import * as React from "react";
import Story from "./Story";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import type { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";

const NewsfeedQuery = graphql`
  query NewsfeedQuery { # query name MUST begin with the module name. In this case, Newsfeed
    topStory {
      ...StoryFragment
    } 
  }
`

export default function Newsfeed() {
  const data = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {})
  console.log('newsfeed data: ', data)

  const story = data.topStory

  return (
    <div className="newsfeed">
      <Story story={story} />
    </div>
  );
}
