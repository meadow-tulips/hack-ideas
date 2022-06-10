import { Component } from 'react';
import styled from 'styled-components';

const StyledErrorBoundary = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    > p {
      font-size: .85rem;
    }
`
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      //Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
  
    render() {
      if (this.state.hasError) {
        return <StyledErrorBoundary>
              <p>Something went wrong ! (js error)</p>
        </StyledErrorBoundary>
      }
  
      return this.props.children; 
    }
  }


export default ErrorBoundary