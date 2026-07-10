import React from 'react';

const TickerBar = () => {
  const tickerItems = [
    "Application Design",
    "UX/UI Design",
    "Website Development",
    "Application Design",
    "UX/UI Design",
    "Website Development",
    "Application Design",
    "UX/UI Design",
    "Website Development",
    "Application Design",
    "UX/UI Design",
    "Website Development"
  ];

  return (
    <div className="bg-brand-blue py-4 overflow-hidden" data-purpose="services-ticker">
      <div className="animate-ticker space-x-12 whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center text-white text-2xl font-bold">
            <img 
              src="https://lh3.googleusercontent.com/aida/AP1WRLs6Kl3QndlwLh-H5O3-Q1L5466tz08-TnSrvZOe8zvIXS8E1trUBrgnOk3433lf3fcQbe6QktrnC0K73_jO3ELi1YJI3FlZdbDA_AIsECIK759b2OjajTXP6GhOmtHcEf983HYXv_E3kbLr399IxR_T6FnJQ8v0YAP_SbSTWbBx6R2ntgCn98IeuCwg2w-NDNXtM6soTnRO7yOkulpVOOVinQ1eoUQMMNhOe2prxwr9jvd39qDgzAP9rMZY" 
              alt="Star Icon" 
              className="w-6 h-6 mr-4 opacity-75" 
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
