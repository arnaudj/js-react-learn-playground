import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/*
= Pitfalls:

React:
- Updating state is tedious (spread operator, nesting)

Router: 
- No props forwarding, use render instead - https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#render-func, https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L120
- Number(): router parameters are strings, need to be cast to int everywhere we expect a number (model)

- Context API: not accessible from lifecycle methods, has to be passed by parent via props (try: https://github.com/SunHuawei/with-context)
*/

const _apiGetComments = storyId => {
  // should be in API module
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, 1000, [
      {
        id: 5010,
        storyId: storyId,
        comment: "A comment loaded from API",
        author: "hal"
      },
      {
        id: 5011,
        storyId: storyId,
        comment: "Another 2nd comment loaded from API",
        author: "9000"
      },
      {
        id: 5012,
        storyId: storyId,
        comment: "Another 3rd comment loaded from API",
        author: "hal"
      }
    ]);
  });
};

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

class Story extends React.Component {
  componentDidMount() {
    const {
      commentsHelpers,
      match: {
        params: { storyId }
      }
    } = this.props;

    const theStoryId = Number(storyId);
    if (!commentsHelpers.get(theStoryId).length) {
      console.log(
        "No comments found for story ",
        theStoryId,
        " querying API..."
      );
      _apiGetComments(theStoryId).then(data => {
        commentsHelpers.add(theStoryId, data);
      });
    }
  }

  render() {
    const {
      stories,
      commentsHelpers,
      match: {
        params: { storyId }
      }
    } = this.props;

    const storyComments = commentsHelpers.get(storyId);

    return (
      <div>
        <h3>
          Reading story {storyId}:{" "}
          {stories.filter(story => story.id === Number(storyId))[0].title}
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

const StoriesList = ({ baseUrl, stories }) => (
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
);

const Stories = ({ match: { url }, stories }) => (
  <div>
    <CommentsContext.Consumer>
      {
        commentsContext => (
          <div>
            <Route
              exact
              path={`${url}/`}
              render={props => <StoriesList baseUrl={url} stories={stories} />}
            />
            <Route
              path={`${url}/:storyId`}
              render={props => <Story {...props} stories={stories} commentsHelpers={commentsContext} />}
            />
          </div>)
      }
    </CommentsContext.Consumer>
  </div>
);

const CommentsContext = React.createContext({
  getComments: undefined,
  addComments: undefined
});

class BasicExample extends React.Component {
  constructor(props) {
    super(props);

    this.getComments = this.getComments.bind(this);
    this.addComments = this.addComments.bind(this);

    this.state = {
      stories: [
        { id: 1000, title: "A story", author: "john" },
        { id: 1001, title: "Another story", author: "jane" }
      ],
      comments: [
        { id: 5000, storyId: 1000, comment: "A comment", author: "jake" }
      ]
    };
  }

  getComments(storyId) {
    const ret = this.state.comments.filter(
      comment => comment.storyId === Number(storyId)
    );
    console.log("getComments: ", storyId, " ", JSON.stringify(ret));
    return ret;
  }

  addComments(storyId, comments) {
    console.log("addComments: ", storyId, " ", JSON.stringify(comments));
    this.setState(prevState =>
      Object.assign({}, prevState, {
        comments: [...prevState.comments, ...comments]
      })
    );
  }

  render() {
    return (
      <CommentsContext.Provider value={{
        get: this.getComments,
        add: this.addComments
      }}>
        <Router>
          <div>
            <Link to="/">Home</Link>
            <br />
            <Link to="/stories">Stories</Link>
            <hr />

            <Route exact path="/" component={Home} />

            <Route
              path="/stories"
              render={props => (
                <Stories
                  {...props}
                  stories={this.state.stories}
                />
              )}
            />
          </div>
        </Router>
      </CommentsContext.Provider>
    );
  }
}

ReactDOM.render(<BasicExample />, document.getElementById("root"));

export default BasicExample;
