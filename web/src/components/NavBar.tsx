import {Box, Link} from "@chakra-ui/core/dist";
import * as React from "react";
import Flex from "@chakra-ui/core/dist/Flex";
import NextLink from 'next/link'
import {useMeQuery} from "../generated/graphql";
import Button from "@chakra-ui/core/dist/Button";

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{data, fetching}] = useMeQuery();
  let body = null;

  if (fetching) {  //user is loading

  } else if (!data?.me) {//user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    )
  } else {// user logged in
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link">Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  )
};