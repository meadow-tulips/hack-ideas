import React, { useCallback, useMemo } from 'react'

import './index.css'
import leftArrow from './icon-left-arrow.svg'
import rightArrow from './icon-right-arrow.svg'

/* TODO: Logic to selectively show page numbers if there are too many pages */

export default function Pagination ({ total, current, className = '', onSelect = () => {} }) {

  const noop = useCallback(() => {}, []);
  
  const leftDisabled = useMemo(() => (current === 1), [current])
  const rightDisabled = useMemo(() => current === total, [current, total]);

  const ellipsis = useMemo(() =>  <span>&#8230;</span>, []);

  const createClickHandler = useCallback(value => e => {
    e && e.preventDefault()
    onSelect(value)
  }, [onSelect]);
 
  if (!Number.isInteger(total) || !Number.isInteger(current)) {
    return null
  }
  let pageNumbers = Array(total).fill(0).map((_, index) => index + 1)
  let spliced = pageNumbers.splice(1, current - 3)
  if (spliced.length) {
    pageNumbers.splice(1, 0, '...')
  }
  spliced = pageNumbers.splice(5, pageNumbers.length - 6)
  if (spliced.length) {
    pageNumbers.splice(5, 0, '...')
  }


  return (
    <div className={`pagination ${className}`}>
      <button className={'pagination-button' + (leftDisabled ? ' pagination-button-disabled' : '')}
        onClick={!leftDisabled ? createClickHandler(current - 1) : noop}
      >
        <img className='navigation-icon' src={leftArrow} alt='Previous' />
      </button>
      {pageNumbers.map((number, index) => (
        <button key={Number.isFinite(number) ? number : 'hellip' + String(index)}
          className={'pagination-button' +
            (current === number ? ' pagination-button-highlighted' : '') +
            (Number.isFinite(number) ? '' : ' pagination-button-disabled')
          }
          onClick={createClickHandler(number)}
        >
          {
            Number.isFinite(number)
              ? number
              : ellipsis
          }
        </button>
      ))}
      <button className={'pagination-button' + (rightDisabled ? ' pagination-button-disabled' : '')}
        onClick={!rightDisabled ? createClickHandler(current + 1) : noop}
      >
        <img className='navigation-icon' src={rightArrow} alt='Next' />
      </button>
    </div>
  )
}
