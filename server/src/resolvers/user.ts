import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import argon2 from "argon2"
import {User} from "../entities/User";
import {EntityManager} from "@mikro-orm/postgresql"

@InputType()
class UsernamePasswordInput {
  @Field()
    // @ts-ignore
  username: string;

  @Field(() => String)
    // @ts-ignore
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
    // @ts-ignore
  field: string;
  @Field()
    // @ts-ignore
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => User, {nullable: true})
  user?: User;
}


@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {req, em}: MyContext
  ) {
    //you are not logged in💩💩💩
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, {id: req.session.userId});
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greater than 2(two)",
          }
        ]
      }
    }

    if (options.password.length <= 4) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greater than 4(four)",
          }
        ]
      }
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert(
          {
            username: options.username,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date,
          }
        )
        .returning('*');
      user = result[0];
    } catch (err) {
      if (err.code === "23505") { //err.detail.includes("already exists"
        //duplicate username error
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken'
            }
          ]
        }
      }
      console.log("message:", err.message)
    }

    req.session.userId = user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username});
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "that username doesnt exist"
          }
        ]
      };
    }

    const valid = await argon2.verify(user.password, options.password); //hashed and plain
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: "incorrect password"
          }
        ]
      }
    }

    req.session.userId = user.id;

    return {
      user
    };
  }
}