import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Pagination = (props) => {
  const [pageNum, setPageNum] = useState(props?.pageNum ?? 1);
  const [path, setPath] = useState(props?.path ?? 0);

  useEffect(() => {
    setPageNum(props?.pageNum ?? 1);
    setPath(props?.path ?? false);
  }, [props]);

  return (
    <div className="flexer">
      <>
        {pageNum > 1 && path ? (
          <div onClick={() => props.setPage(pageNum-1)}>
          <Link
            className="marvel-alt"
            to={`${path}${parseInt(pageNum) - 1}`}
          >
            Previous Page
          </Link>
          </div>
        ) : (
          <></>
        )}
      </>
      <>
        {pageNum < 79 && path ? (
          <div onClick={() => props.setPage(pageNum+1)}>
          <Link
            className="marvel-alt"
            to={`${path}${parseInt(pageNum) + 1}`}
          >
            Next Page
          </Link>
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  );
};

export default Pagination;
