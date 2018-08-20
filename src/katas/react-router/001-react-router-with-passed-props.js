import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/*
Pitfalls:
Number(): workaround router param is string...
*/
const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

class Story extends React.Component {
  render() {
    const {
      stories,
      comments,
      match: {
        params: { storyId }
      }
    } = this.props;
    return (
      <div>
        <h3>
          Reading story {storyId}:{" "}
          {stories.filter(story => story.id === Number(storyId))[0].title}
          <br />
        </h3>
        <div>
          Story comments:<br />
          {comments
            .filter(comment => comment.storyId === Number(storyId))
            .map(comment => (
              <div key={comment.id}>
                - {comment.author}: {comment.comment}
                <br />
              </div>
            ))}
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

const Stories = ({ match: { url }, stories, comments }) => (
  <div>
    <Route
      exact
      path={`${url}/`}
      render={props => <StoriesList baseUrl={url} stories={stories} />}
    />
    <Route
      path={`${url}/:storyId`}
      render={props => (
        <Story {...props} stories={stories} comments={comments} />
      )}
    />
  </div>
);

class BasicExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [
        { id: 1000, title: "A story", author: "john" },
        { id: 1001, title: "Another story", author: "jane" }
      ],
      comments: [
        { id: 5000, storyId: 1000, comment: "A comment", author: "jake" }
      ]

      /*getComments: function(storyId) {
        return this.comments.filter(
          comment => comment.storyId === Number(storyId)
        ); // workaround router param is string...
      }*/
    };
  }

  render() {
    return (
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
            render={props => (
              <Stories
                {...props}
                stories={this.state.stories}
                comments={this.state.comments}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<BasicExample />, document.getElementById("root"));

export default BasicExample;
