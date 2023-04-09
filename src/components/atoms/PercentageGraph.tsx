import * as React from "react";
import css from "src/styles/PercentageGraph.module.css";

const PercentageGraph: React.FC<{ title: string; size: string }> = ({
  title,
  size,
}) => {
  return (
    <>
      <div className={css.Grid}>
        <div aria-hidden="true" className={css.Title}>
          {title}
        </div>
        <div aria-hidden="true" className={css.GraphBackground}>
          <div style={{ width: size }} className={css.GraphColor}></div>
        </div>
      </div>
    </>
  );
};

export default PercentageGraph;
