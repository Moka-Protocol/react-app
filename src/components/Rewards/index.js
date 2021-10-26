import React, { useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";
import { getRewardDateOptions, getLeaderboardQueryVariableId, getPostsQuery, returnRewardCount, parsePostsData } from 'constants/functions';

//GQL
import { GET_LEADERBOARD } from 'gql/queries';

//COMPONENTS
import Reward from 'components/Items/Reward';
import Moka from 'assets/svgs/moka';

//STYLES
import { Header, DateSelect, SettledBar, Body } from './styles';

function Rewards(props) {
  let dateOptions = getRewardDateOptions(props.parentProps.match.params.type);
  const [date, setDate] = useState(null);

  const { data: dataLeaderboard, loading: loadingLeaderboard } = useQuery(gql(GET_LEADERBOARD), {
    variables: { id: getLeaderboardQueryVariableId(props.parentProps.match.params.type, date) },
    skip: !date
  });

  const { data: dataPosts } = useQuery(gql(getPostsQuery(props.parentProps.match.params.type)), {
    variables: { id: date },
    skip: !date
  });
  
  const dataSettled = (dataLeaderboard && dataLeaderboard.leaderboard) ? true : false;
  const postsDataResults = parsePostsData(props.parentProps.match.params.type, dataPosts);

  useEffect(() => {
    if (!props.parentProps.match.params.date) {
      let newDate = getRewardDateOptions(props.parentProps.match.params.type)[0];
      props.parentProps.history.push('/rewards/' + props.parentProps.match.params.type + '/' + newDate);
      setDate(newDate);
    }

    if (props.parentProps.match.params.date && !date) {
      setDate(props.parentProps.match.params.date);
    }

    if (!props.parentProps.match.params.date && !date) {
      setDate(dateOptions[0]);
    }
  },[props.parentProps, date, dateOptions]);

  const handleDateChange = (date) => {
    props.parentProps.history.replace({ pathname: '/rewards/' + props.parentProps.match.params.type + '/' + date});
    setDate(date);
  }

  return (
    <React.Fragment>
      <Header>
        <DateSelect name="category" value={date ? date : ''} onChange={event => handleDateChange(event.target.value)}>
          {
            dateOptions && dateOptions.map((item, index) =>
              <option id={index} key={index}>{item}</option>
            )
          }
        </DateSelect>
      </Header>
      {
        loadingLeaderboard !== true &&
        <React.Fragment>
          <SettledBar complete={dataSettled}>
            <div style={{ display: 'flex' }}>
              { dataSettled && <div>{dataLeaderboard.leaderboard.reward / (10 ** 18)}</div> }
              { !dataSettled && <div>{returnRewardCount(props.parentProps.match.params.type, dataPosts)}</div> }
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '2px' }}><Moka size="12px" /></div>
              { dataSettled && <div style={{ fontSize: '0.9em', marginLeft: '3px' }}>- completed</div> }
              { !dataSettled && <div style={{ fontSize: '0.9em', marginLeft: '3px' }}>- in progress</div> }
            </div>
          </SettledBar>
          <Body>
            {
              dataSettled &&
              <React.Fragment>
                {
                  dataLeaderboard.leaderboard && dataLeaderboard.leaderboard.payouts && dataLeaderboard.leaderboard.payouts.map((item, index) => 
                    <Reward
                      type="settled"
                      key={index}
                      index={index}
                      account={props.account}
                      userUpvotes={props.userUpvotes}
                      item={item}
                    />
                  )
                }
              </React.Fragment>
            }
            {
              !dataSettled &&
              <React.Fragment>
                {
                  postsDataResults && postsDataResults.posts && postsDataResults.posts.map((item, index) => 
                    <Reward
                      type="in-progress"
                      key={index}
                      index={index}
                      account={props.account}
                      userUpvotes={props.userUpvotes}
                      item={item}
                    />
                  )
                }
              </React.Fragment>
            }
          </Body>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Rewards;