import React from 'react';
import { gql, useQuery } from "@apollo/client";

//GQL
import { GET_USER_POSTS } from 'gql/queries';

//COMPONENTS
import Post from 'components/Items/Post';

function ProfilePosts(props) {
  const { data } = useQuery(gql(GET_USER_POSTS), { variables: { id: props.account && props.account.toString().toLowerCase() }, skip: !props.account });

  return (
    <React.Fragment>
      {
        data && data.user && data.user.posts && data.user.posts.map((item, index) =>
          <Post key={index} index={index} account={props.account} userUpvotes={props.userUpvotes} item={item} />
        )
      }
    </React.Fragment>
  );
}

export default ProfilePosts;