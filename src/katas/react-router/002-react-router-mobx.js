import ReactDOM from "react-dom";
import React from "react";
import {
  observable,
  decorate,
  action,
  configure,
  runInAction,
  autorun
} from "mobx";
import { observer, inject, Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { apiGetComments } from "./api";

/*
= Notes:
Decorators not available without babel (needs to eject create react app, or change create react app scripts to a fork)
When using a reaction/autorun: watched observable must have one of its properties accessed to register the reaction (and won't register if this access is done inside a runInaction within the reaction) - https://mobx.js.org/best/react.html#incorrect-use-an-observable-but-without-accessing-any-of-its-properties

= To improve:
- drop react-router in favor of store centric logic: https://hackernoon.com/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37
*/

configure({ enforceActions: "always" });

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const Story = inject("store")(
  observer(
    // observer needed for render() refresh, since references observable - https://github.com/mobxjs/mobx/issues/101#issuecomment-189818379
    class Story extends React.Component {
      // lifecycle: everytime displayed by router (even on visit again)
      componentWillMount() {
        this.props.store.actionUserNavigatesToStory(
          this.props.match.params.storyId
        );
      }

      // lifecycle: everytime navigated away by router
      componentWillUnmount() {}

      render() {
        const {
          store,
          match: {
            params: { storyId }
          }
        } = this.props;

        console.log(`story#${storyId}: render()`);

        const theStoryId = Number(storyId);

        const storyComments = store.storyComments(theStoryId);
        const isFetching = store.story(theStoryId).isFetching;
        return (
          <div>
            <h3>
              Reading story {storyId}: {store.story(theStoryId).title}
              <br />
            </h3>
            {isFetching ? (
              <span>Loading...</span>
            ) : (
              <div>
                Story comments:<br />
                {storyComments.length > 0
                  ? storyComments.map(comment => (
                      <div key={comment.id}>
                        - {comment.author}: {comment.comment}
                        <br />
                      </div>
                    ))
                  : "No comment"}
              </div>
            )}
          </div>
        );
      }
    }
  )
);

const StoriesList = inject("store")(({ baseUrl, store: { stories } }) => (
  <div>
    <h2>Stories</h2>
    <div>
      {[...stories.values()].map(story => (
        <div key={story.id}>
          <Link to={`${baseUrl}/${story.id}`}>{story.title}</Link>
        </div>
      ))}
    </div>
  </div>
));

const Stories = ({ match: { url } }) => (
  <div>
    <Route
      exact
      path={`${url}/`}
      render={props => <StoriesList baseUrl={url} {...props} />}
    />
    <Route path={`${url}/:storyId`} render={props => <Story {...props} />} />
  </div>
);

class Store {
  stories;
  comments;
  fetchList;

  _shiftFetchList(val) {
    return this.fetchList.shift();
  }

  initStore() {
    this.stories = new Map([
      [1000, { id: 1000, title: "A story", author: "john" }],
      [1001, { id: 1001, title: "Another story", author: "jane" }]
    ]);
    this.comments = [
      { id: 5000, storyId: 1000, comment: "A comment", author: "jake" }
    ];
    this.fetchList = [];

    autorun(() => {
      if (this.fetchList.length === 0) return; // touch fetchList property to register reaction
      const storyId = this._shiftFetchList();

      if (this.storyComments(storyId).length) {
        console.log(`Fetch for ${storyId}: cache hit`);
        return;
      }
      const story = this.story(storyId);
      if (story.isFetching) {
        console.log(`Fetch for ${storyId}: already fetching`);
        return;
      }

      console.log(`Fetch for ${storyId}: querying API...`);
      runInAction(() => (story.isFetching = true));
      apiGetComments(storyId).then(data => {
        runInAction("apiGetCommentsSuccess", () => {
          this._addStoryComments(storyId, data);
          story.isFetching = false;
        });
      });
    });
  }

  actionUserNavigatesToStory(id) {
    this.fetchList.push(Number(id));
    console.log(
      "actionUserNavigatesToStory(): after: fetchList: " + this.fetchList
    );
  }

  storyComments(storyId) {
    return this.comments.filter(comment => comment.storyId === storyId);
  }

  story(storyId) {
    return this.stories.get(storyId);
  }

  _addStoryComments(storyId, comments) {
    console.log(
      "addActiveStoryComments: ",
      storyId,
      " ",
      JSON.stringify(comments)
    );
    this.comments.push(...comments);
  }
}
// decorators not available without babel, use decorate - https://mobx.js.org/refguide/modifiers.html
decorate(Store, {
  stories: observable,
  comments: observable,
  isFetching: observable,
  fetchList: observable,
  initStore: action.bound,
  actionUserNavigatesToStory: action.bound,
  _addStoryComments: action.bound,
  _shiftFetchList: action.bound
});

class BasicExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { store: props.store }; // hop via state, else in render() propagation of props to Stories will fail on 2nd iteration (happens right after 1st one where props is available)
  }
  render() {
    return (
      <Provider store={this.state.store}>
        <React.Fragment>
          <Router>
            <div>
              <Link to="/">Home</Link>
              <br />
              <Link to="/stories">Stories</Link>
              <hr />
              <Route exact path="/" component={Home} />
              <Route path="/stories" render={props => <Stories {...props} />} />
            </div>
          </Router>
          <DevTools />
        </React.Fragment>
      </Provider>
    );
  }
}

const store = new Store();
store.initStore();

ReactDOM.render(
  <BasicExample store={store} />,
  document.getElementById("root")
);
export default BasicExample;
