import React from 'react';
import { gql, useQuery } from "@apollo/client";

//GQL
import { GET_USER_ACTIVITY } from 'gql/queries';

//COMPONENTS
import Activity from 'components/Items/Activity';

function ProfileActivity(props) {
  const { data } = useQuery(gql(GET_USER_ACTIVITY), { variables: { id: props.account && props.account.toString().toLowerCase() }, skip: !props.account });

  return (
    <React.Fragment>
      {
        data && data.user && data.user.activity && data.user.activity.map((item, index) =>
          <Activity key={index} index={index} account={props.account} userUpvotes={props.userUpvotes} item={item} />
        )
      }
    </React.Fragment>
  );
}

export default ProfileActivity;