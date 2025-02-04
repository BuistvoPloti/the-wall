import React from "react";
import {Field} from "ast-types";
import {Box, FormControl, FormErrorMessage, Button, FormLabel, Input} from "@chakra-ui/core";
import {Form, Formik} from "formik";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {useMutation} from "urql";
import {useRegisterMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";

interface registerProps {
}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{username: "", password: ""}}
        onSubmit={async (values,{setErrors}) => {
          const response = await register(values);
          if(response.data?.register.errors){
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            //worked
            router.push("/");
          }
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}  //errors caused by my chromes extensions xz 🥴🥴
              variantColor="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
