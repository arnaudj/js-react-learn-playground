import ReactDOM from "react-dom";
import React from "react";
import { observable, decorate, computed, action } from "mobx";
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

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const Story = inject("store")(
  observer(
    // observer needed for render() refresh, since references observable - https://github.com/mobxjs/mobx/issues/101#issuecomment-189818379
    class Story extends React.Component {
      componentWillMount() {
        const {
          store,
          match: {
            params: { storyId }
          }
        } = this.props;
        const theStoryId = Number(storyId);

        store.setActiveStoryId(theStoryId);
        if (!store.activeStoryComments.length) {
          console.log(
            "No comments found for story ",
            theStoryId,
            " querying API..."
          );
          apiGetComments(theStoryId).then(data => {
            store.addActiveStoryComments(data);
          });
        }
      }

      render() {
        const {
          store,
          match: {
            params: { storyId }
          }
        } = this.props;
        const storyComments = store.activeStoryComments;
        return (
          <div>
            <h3>
              Reading story {storyId}:{" "}
              {
                store.stories.filter(story => story.id === Number(storyId))[0]
                  .title
              }
              <br />
            </h3>
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
      {stories.map(story => (
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
  activeStoryId = -1;

  stories = [
    { id: 1000, title: "A story", author: "john" },
    { id: 1001, title: "Another story", author: "jane" }
  ];

  comments = [
    { id: 5000, storyId: 1000, comment: "A comment", author: "jake" }
  ];

  setActiveStoryId(id) {
    this.activeStoryId = id;
    console.log("setActiveStoryId", this.activeStoryId);
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

  addActiveStoryComments(comments) {
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
  addActiveStoryComments: action.bound, // bind this
  setActiveStoryId: action.bound,
  activeStoryComments: computed
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

ReactDOM.render(
  <BasicExample store={store} />,
  document.getElementById("root")
);
export default BasicExample;
