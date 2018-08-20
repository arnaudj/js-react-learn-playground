import ReactDOM from "react-dom";

import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const store = {
  stories: [
    { id: 1000, title: "A story", author: "john" },
    { id: 1001, title: "Another story", author: "jane" }
  ]
};

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const Story = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

const Stories = ({ store: { stories } }) => (
  <div>
    <h2>Stories</h2>
    <div>
      {stories.map(story => (
        <div>
          <Link to={`story/${story.id}`}>{story.title}</Link>
        </div>
      ))}
    </div>
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
