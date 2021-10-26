import React from 'react';
import { gql, useQuery } from "@apollo/client";

//GQL
import { GET_ALL_POSTS } from 'gql/queries';

//COMPONENTS
import Post from 'components/Items/Post';

function Feed(props) {
  const { data } = useQuery(gql(GET_ALL_POSTS));

  return (
    <React.Fragment>
      {
        data && data.posts && data.posts.map((item, index) =>
          <Post key={index} index={index} account={props.account} userUpvotes={props.userUpvotes} item={item} txErrorCallback={props.txErrorCallback} />
        )
      }
    </React.Fragment>
  );
}

export default Feed;