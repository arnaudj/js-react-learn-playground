import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const store = {
  stories: [
    { id: 1000, title: "A story", author: "john" },
    { id: 1001, title: "Another story", author: "jane" }
  ],
  comments: [{ id: 5000, storyId: 1000, comment: "A comment", author: "jake" }],

  getComments: function(storyId) {
    return this.comments.filter(comment => comment.storyId === Number(storyId)); // workaround router param is string...
  }
};

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

class Story extends React.Component {
  render() {
    const {
      store,
      match: {
        params: { storyId }
      }
    } = this.props;
    return (
      <div>
        <h3>Reading story {storyId}</h3>
        <div>
          Story comments:
          {store.getComments(storyId).map(comment => (
            <div>
              - {comment.author}: {comment.comment}
              <br />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const StoriesList = ({ match, store }) => (
  <div>
    <h2>Stories</h2>
    <div>
      {store.stories.map(story => (
        <div>
          <Link to={`${match.url}/${story.id}`}>{story.title}</Link>
        </div>
      ))}
    </div>
  </div>
);

const Stories = ({ match, store }) => (
  <div>
    <Route
      exact
      path={`${match.url}/`}
      render={props => <StoriesList {...props} store={store} />}
    />
    <Route
      path={`${match.url}/:storyId`}
      render={props => <Story {...props} store={store} />}
    />
  </div>
);

const BasicExample = () => (
  <Router>
    <div>
      <Link to="/">Home</Link>
      <br />
      <Link to="/stories">Stories</Link>
      <hr />

      <Route exact path="/" component={Home} />

      {/* No props forwarding, use render instead - https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#render-func
      https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L120 */}
      <Route
        path="/stories"
        render={props => <Stories store={store} {...props} />}
      />
    </div>
  </Router>
);

ReactDOM.render(<BasicExample />, document.getElementById("root"));

export default BasicExample;
