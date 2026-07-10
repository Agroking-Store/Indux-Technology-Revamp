import React from 'react';

const BlogContent = () => {
  return (
    <main className="py-16 md:py-24" data-purpose="blog-content">
      <div className="container mx-auto px-4">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <div className="flex items-center text-gray-500 text-sm font-medium mb-2">
              <span className="w-8 h-[2px] bg-brand-blue mr-3" />
              News & Blogs
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Latest <span className="text-brand-blue">News & Blogs</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
            <button className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-medium shadow-md">All</button>
            <button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition">UI/UX</button>
            <button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition">Development</button>
            <button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition">Marketing</button>
          </div>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Featured Post (Full Width) */}
          <article className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group h-[400px] md:h-[500px]">
            <img 
              alt="The Future of Web Development" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEy7xjk3NQEkGAoE2Q5MVtlzr3gnmw2KCruz_b2Zx84Zjv7NYmgm4zPAGuqsPRnTnbGWHNQe8mijdePUURLJLpQZJFGn-NPl5UICK2EugujYJjV0zf3vmcFecDtO1lRyjeaL4Kre0cQ-VNxNSU_YXgGk_b_uQXZqdIFSnZZfS3q7U_HhBboTXNhiB32d2m6BfMQMHjjhvIZ_8cqXra-eVzcBTp6Cw6caaJiEj28AmzMC_zQRE7iuA2mQ" 
            />
            <div className="absolute inset-0 blog-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-center flex flex-col items-center">
              <div className="text-gray-300 text-sm font-medium mb-3">
                May 21, 2022 - Marketing
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight max-w-3xl">
                <a className="hover:text-gray-200 transition" href="#">The Future of Web Development: Trends To Watch in 2025</a>
              </h3>
              <div className="flex items-center space-x-3">
                <img 
                  alt="Rakhael Muhammad" 
                  className="w-10 h-10 rounded-full border-2 border-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAmXSS43_FP29s0RIH9elo9CPNDKyzYp3DXic4Q28JBtbFXzAVMTyLd6qvODnzu67HMg-KUGi2Lj_j-HpI3bdiL3VSIWnB_z-CB7i-cDhLFfv8i2XwQNotSg_D3qOsH0KN4rqvmSnThbiLJELuAz2qjZsOelzsGSzHIAaN-8KJjXgskFQeXXoHCSUgcGUWjHPTpkVhWAwn2l3KBw680v00mB_F3DqI2WAl-G5LPvw89ZIsrA8BqMyyPg" 
                />
                <span className="text-white font-medium">Rakhael Muhammad</span>
              </div>
            </div>
          </article>
          
          {/* Standard Post 1 */}
          <article className="relative rounded-2xl overflow-hidden group h-[300px] md:h-[350px]">
            <img 
              alt="Best Practices For Designing a User-Friendly Mobile App" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFaSsDPz8eB6FSxu9b3xDBo-OPZPGzqtIArSmvjk9RS8FTQwsTNtlszcj6YxP4fMGd-aB3LjrDSF5iPYtQKnX4YpObbM58da1-uYUhtLYSVAXckSsB0aK_egVGIcu4wLtdJ9kK42DHhIqpUBkeWvcOp00hItRhKLMuKOJhDPX2H2X2menM5LRbz3FQkyhYot58gqfxDj4GBx2WGTxybe8ZY9Gr0Q9-0WtnzuFNJ-G0l0ttTPYyeBVoeQ" 
            />
            <div className="absolute inset-0 blog-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center flex flex-col items-center">
              <div className="text-gray-300 text-sm font-medium mb-2">
                June 21, 2022 - Marketing
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                <a className="hover:text-gray-200 transition" href="#">
                  Best Practices For Designing a<br/>User- Friendly Mobile App
                </a>
              </h3>
              <div className="flex items-center space-x-3">
                <img 
                  alt="Yahya Man" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKSVg_wcv16WCeVVgRESsbyzqNTesdMfR3CzN-kLhqf8OeQnurdxRChQTVX8_8sSmLnxMAx-ZpCBjmYDQWNMcjrthM9HydWWc086NwnKnOcL5pHq1Lp4SXcndGaPDu4-nGy0IHMTndgzxFWCttW13vmMbcrQYNiyQ50Bup5_9CCjneRiASQhStV5de2eioRCMROW3_7rXTfMY-sq8cWEk1YSiAA4KAi5sA6xlHU_2ZdyntW06_grCVWQ" 
                />
                <span className="text-white font-medium text-sm">Yahya Man</span>
              </div>
            </div>
          </article>
          
          {/* Standard Post 2 */}
          <article className="relative rounded-2xl overflow-hidden group h-[300px] md:h-[350px]">
            <img 
              alt="3 tips to increase engagement on social media" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsq_osaRnvtnq1nWYWdEW9z6z_n0pDYXnGVMjpT_3kLr4W0JScKsl8yQ2hY37vRbzUVUaxFkS2pVQHHELUo10QBxH6yqvn0QtxiLWp077Pne6rxuDfC4wjMn4HPSdbDPpvwLbo2JqCg_rTsflkpd2kF_EhfQMUpMHdldtkK1IMoOyE4kETkQ-F4T0M1Rg2gT050YvHYHRdABGq6HJSeHB1ZrmaR9_3BYy0KyY7ToFa6iHWWakhN-ncyQ" 
            />
            <div className="absolute inset-0 blog-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center flex flex-col items-center">
              <div className="text-gray-300 text-sm font-medium mb-2">
                June 21, 2022 - Marketing
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                <a className="hover:text-gray-200 transition" href="#">
                  3 tips to increase engagement on social<br/>media
                </a>
              </h3>
              <div className="flex items-center space-x-3">
                <img 
                  alt="Yahya Man" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6v20RRMMZ3mBWBzRfftTgBndW-iHnPqmty_BOjpLYv5P_u0lj4CCu8hObnVw5QNVUJNTnJFjWjyfuCURXiCQw_83nPjihqQ58njfw4uwCW5y-mmKS3IED-WGd2u6_IUApVb4FDmhlKg631Y3i_EUqTURWO1xuoIWWFsoqzLvjQERPg5VhUt_vCka2aYCJHh83Lit3XBvvKRT3OWIT1qqZDo5N192_F2XxcWVjkPCHTJnqv0ROpFAO2A" 
                />
                <span className="text-white font-medium text-sm">Yahya Man</span>
              </div>
            </div>
          </article>
          
          {/* Standard Post 3 */}
          <article className="relative rounded-2xl overflow-hidden group h-[300px] md:h-[350px]">
            <img 
              alt="3 tips to increase engagement on social media" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_jtJqwTMobYXqZoqSIcVEOK-d4BqGTImTRwcVY4mWpCewJSDFyl-knhNXTFowV0_X-qCPyc6oRaObQGC0Rau_3QzDiL79969dUK-JkR7rjksAdNVDB77wEagf09QcrBuavQ4es7G0iiGD6IltAw4ZJl6nci7MnTcDwaTNSkTVn1bea_QAxl4_anCn6QPjWFGl_OvR20hfhOOkg5BnyVax_mX7chS_ZgkESHuSH3cjm-hp5jlMBspPWw" 
            />
            <div className="absolute inset-0 blog-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center flex flex-col items-center">
              <div className="text-gray-300 text-sm font-medium mb-2">
                June 21, 2022 - Marketing
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                <a className="hover:text-gray-200 transition" href="#">
                  3 tips to increase engagement on social<br/>media
                </a>
              </h3>
              <div className="flex items-center space-x-3">
                <img 
                  alt="Yahya Man" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwWlVoqj2VF52zR6co7tD1DGeOWSyUtgAY-nQKxtpwEd9I7VabNqYBgMU_HDNWxTgfQnS-zzroYSq0E_wDLNuxZhTu5aO6lcnprpda7ndWQ5rZFQpv3qiie3hKdlP29HfJklStXe8WcZG8mc33NT_cRSqaKRd_vZDEhAeog3oLvFZS8_YrusKM3AGbXVWJNKqjhxE1w8zW2-XqvLF4fC_dTixhxFbxNd6oGyptrRpCBAYGJFrKc8lxbA" 
                />
                <span className="text-white font-medium text-sm">Yahya Man</span>
              </div>
            </div>
          </article>
          
          {/* Standard Post 4 */}
          <article className="relative rounded-2xl overflow-hidden group h-[300px] md:h-[350px]">
            <img 
              alt="The Rise of Super Apps: What It Means for Business and Consumers" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFOV1_crB9HJppL7l8pIe8-EFYL94kx5_6m-jS5G6KtB3gROEaEPWMBngR251gJVww37s1PCb5ZPgc3U5rKxl41zMVurvgeDz9WUsqGhhzYDG8igvGXZKohyUHISKpeansvfI0U0hX038azuMnD_x-CutbV4JGXUuF7KwUGBqxePOCNYQ0rFC4KYi5wf6H5H7wSwqFzYI9r_Qcu9H50OHPvJHOLrWlqV9SNSTx2Q9WBkXCJBsIPuWE3w" 
            />
            <div className="absolute inset-0 blog-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center flex flex-col items-center">
              <div className="text-gray-300 text-sm font-medium mb-2">
                June 21, 2022 - Marketing
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                <a className="hover:text-gray-200 transition" href="#">
                  The Rise of Super Apps: What It Means<br/>for Business and Consumers
                </a>
              </h3>
              <div className="flex items-center space-x-3">
                <img 
                  alt="Yahya Man" 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUlRid79N3iOkIJZB-5oXPVNFHLM-t2zpcrXYv4kXNhFxZobTU3UHCD1NMP0F2xoPWG4pEtJwQQ7Ftt0aZhl5gyGL2bS0cWlCO_cGS_FTtCalTGGxgeflCW2sEXccdjqLtzVR8nbbiRqR7-wD17yi4X8pl03kNy3K13YDvqn53WANjhuxwM2zXVG7Qjy0tFdC0XiwRoJZIY2JeDTnFAf_C7HhXtOI9YeAUojvwQaPswqCwDcvO7H6HhA" 
                />
                <span className="text-white font-medium text-sm">Yahya Man</span>
              </div>
            </div>
          </article>
        </div>
        
        {/* View More Button */}
        <div className="text-center">
          <a className="inline-block bg-brand-blue hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-full shadow-lg transition" href="#">
            View More
          </a>
        </div>
      </div>
    </main>
  );
};

export default BlogContent;
