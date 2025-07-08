import * as React from "react";
import Story from "./Story";
import { graphql } from "relay-runtime";
import {
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
} from "react-relay";
import type { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import { NewsfeedContentsFragment$key } from "./__generated__/NewsfeedContentsFragment.graphql";
import type { NewsfeedContentsRefetchQuery as NewsfeedContentsRefetchQueryType } from "./__generated__/NewsfeedContentsRefetchQuery.graphql";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";

const NewsfeedQuery = graphql`
  query NewsfeedQuery {
    # query name MUST begin with the module name. In this case, Newsfeed
    ...NewsfeedContentsFragment
  }
`;

const NewsfeedContentsFragment = graphql`
  fragment NewsfeedContentsFragment on Query
  @refetchable(queryName: "NewsfeedContentsRefetchQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int", defaultValue: 3 }
  ) {
    viewer {
      newsfeedStories(after: $cursor, first: $count)
        @connection(key: "NewsfeedContentsFragment_newsfeedStories") {
        edges {
          node {
            id
            ...StoryFragment
          }
        }
      }
    }
  }
`;

export default function Newsfeed() {
  const queryData = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {});
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    NewsfeedContentsRefetchQueryType,
    NewsfeedContentsFragment$key
  >(NewsfeedContentsFragment, queryData);

  const onEndReached = () => {
    loadNext(1);
  };

  const storyEdges = data.viewer.newsfeedStories.edges;

  return (
    <div className="newsfeed">
      {storyEdges.map((storyEdge) => (
        <Story key={storyEdge.node.id} story={storyEdge.node} />
      ))}
      <InfiniteScrollTrigger
        onEndReached={onEndReached}
        isLoadingNext={isLoadingNext}
        hasNext={hasNext}
      />
    </div>
  );
}
