import { scroller } from "react-scroll";

// excluded React component syntax...

scrollToSection = () => {
  scroller.scrollTo("your_css_class_here", {
    duration: 800,
    delay: 0,
    smooth: "easeInOutQuart",
  });
};
class ReadyToScroll extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  render() {
    return <div ref={this.myRef}></div>;
  }

  scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop);
  // run this method to execute scrolling.
}
