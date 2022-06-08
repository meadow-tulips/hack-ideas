import { Component } from 'react';
import styled from 'styled-components';

const StyledErrorBoundary = styled.div`
    width: 100%;
    height: 100%;
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
  
    render() {
      if (this.state.hasError) {
        const url = `/error/404.png`;
        return <StyledErrorBoundary>
            <img src={url} alt="error-code" />
        </StyledErrorBoundary>
      }
  
      return this.props.children; 
    }
  }


export default ErrorBoundary