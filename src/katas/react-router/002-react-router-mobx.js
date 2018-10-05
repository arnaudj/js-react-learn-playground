import ReactDOM from "react-dom";
import React from "react";
import {
  observable,
  decorate,
  computed,
  action,
  configure,
  runInAction,
  reaction
} from "mobx";
import { observer, inject, Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { apiGetComments } from "./api";

/*
= Notes:
Observing active story comments is hackish (set by ID, then observed via computed property)
Decorators not available without babel (needs to eject create react app, or change create react app scripts to a fork)

= To improve:
- wrt active story comments: loading is triggered by Story.componentWillMount, but it should
 be triggered by a model action instead
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
        const {
          store,
          match: {
            params: { storyId }
          }
        } = this.props;
        store.actionUserNavigatesToStory(storyId);
        //console.log(`story#${storyId}: componentWillMount()`);
      }

      // lifecycle: everytime navigated away by router
      componentWillUnmount() {
        //console.log(`story#${this.props.match.params.storyId}: componentWillUnmount()`);
      }

      render() {
        const {
          store,
          match: {
            params: { storyId }
          }
        } = this.props;

        console.log(`story#${storyId}: render()`);
        const storyComments = store.activeStoryComments;
        const isFetching = store.isFetching;
        return (
          <div>
            <h3>
              Reading story {storyId}: {store.activeStoryTitle}
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
  isFetching;

  activeStoryId;
  stories;
  comments;

  initStore() {
    this.stories = new Map([
      [1000, { id: 1000, title: "A story", author: "john" }],
      [1001, { id: 1001, title: "Another story", author: "jane" }]
    ]);
    this.comments = [
      { id: 5000, storyId: 1000, comment: "A comment", author: "jake" }
    ];
    this.isFetching = false;
    this.activeStoryId = -1;

    reaction(
      () => this.activeStoryId,
      activeStoryId => {
        console.log(`Story changed to ${activeStoryId}`);

        if (activeStoryId <= 0) return;
        if (this.activeStoryComments.length) return;
        console.log(
          `No comments found for story ${activeStoryId}, querying API...`
        );
        this.isFetching = true;

        apiGetComments(activeStoryId).then(data => {
          runInAction("apiGetCommentsSuccess", () => {
            this._addActiveStoryComments(data);
            this.isFetching = false;
          });
        });
      },
      { name: "activeStoryIdWatcher" }
    );
  }

  actionUserNavigatesToStory(id) {
    const theStoryId = Number(id);
    this._setActiveStoryId(theStoryId);
  }

  get activeStoryComments() {
    const ret = this.comments.filter(
      comment => comment.storyId === this.activeStoryId
    );
    console.log(
      "activeStoryComments: ",
      this.activeStoryId,
      " ",
      JSON.stringify(ret)
    );
    return ret;
  }

  get activeStoryTitle() {
    return this.stories.get(this.activeStoryId).title;
  }

  _setActiveStoryId(id) {
    this.activeStoryId = Number(id);
    console.log("setActiveStoryId", this.activeStoryId);
  }

  _addActiveStoryComments(comments) {
    console.log(
      "addActiveStoryComments: ",
      this.activeStoryId,
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
  activeStoryId: observable,
  isFetching: observable,
  initStore: action.bound,
  actionUserNavigatesToStory: action.bound,
  activeStoryComments: computed,
  activeStoryTitle: computed
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
