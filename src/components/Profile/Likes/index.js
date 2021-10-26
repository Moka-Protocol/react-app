import React from 'react';
import { gql, useQuery } from "@apollo/client";

//GQL
import { GET_USER_UPVOTES } from 'gql/queries';

//COMPONENTS
import Post from 'components/Items/Post';

function ProfileLikes(props) {
  const { data } = useQuery(gql(GET_USER_UPVOTES), { variables: { id: props.account && props.account.toString().toLowerCase() }, skip: !props.account });

  return (
    <React.Fragment>
      {
        data && data.user && data.user.upvotes && data.user.upvotes.map((item, index) =>
          <Post key={index} index={index} account={props.account} userUpvotes={props.userUpvotes} item={item.post} />
        )
      }
    </React.Fragment>
  );
}

export default ProfileLikes;