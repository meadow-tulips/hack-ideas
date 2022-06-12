import styled from 'styled-components'

const StyledCellCommonCss = `
min-width: 7rem;
max-width: 10rem;
padding: 1.2rem;
font-weight: 200;
font-size: .85rem;
border-bottom: 1px solid #dee2e6;
text-align: center;
:first-of-type {
    text-align: left;
}
:last-of-type {
    text-align: right;
}
`

const StyledTable = styled.table`
    width: 100%;
    padding: 0 1.5rem;
    border-spacing: 0;
`

const StyledCell = styled.td`
    ${StyledCellCommonCss}
`
const StyledHeaderCell = styled.th`
  ${StyledCellCommonCss}
  text-transform: capitalize;
  font-weight: 500;
  padding: .75rem;
  border-bottom: 2px solid #dee2e6
`

const StyledTableRow = styled.tr`
    cursor: pointer;
    :nth-child(2n + 2) {
        background: rgba(0,0,0,.05);
    }
`

const TableRow = ({ children, handleClick }) => {
 return <StyledTableRow onClick={handleClick}>
        {children}
    </StyledTableRow>
}

const CellHeader = ({ children }) => {
    return <StyledHeaderCell>
        {children}
    </StyledHeaderCell>
}

const Cell = ({ children, className }) => {
    return <StyledCell className={className}>
        {children}
    </StyledCell>
}

const Table = ({ children }) => {
    return <StyledTable>
        {children}
    </StyledTable>
}

export default Table;
export {
    Cell,
    CellHeader,
    TableRow
}