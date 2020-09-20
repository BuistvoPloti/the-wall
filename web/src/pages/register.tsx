import React from "react";
import {Field} from "ast-types";
import {Box, FormControl, FormErrorMessage,Button, FormLabel, Input} from "@chakra-ui/core";
import {Form, Formik} from "formik";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";

interface registerProps {
}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="regular">
      <Formik initialValues={{username: "", password: ""}} onSubmit={values => console.log(values)}>
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
              isLoading={isSubmitting}  //works from time to time 🥴🥴
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
