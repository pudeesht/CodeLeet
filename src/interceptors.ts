export function attachInterceptor() {

  // @ts-ignore
  const realWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  console.log("🕵️ Detective: Interceptor Initiated on", realWindow === window ? "Standard Window" : "Unsafe Window");

  const originalFetch = realWindow.fetch;

  realWindow.fetch = async (...args: any[]) => {
    const [resource, config] = args;

    if (typeof resource === 'string' && resource.includes('/check/')) {
      console.log("🎯 DETECTED CHECK:", resource);
      
      try {
        const response = await originalFetch(resource, config);
        
        const clone = response.clone();
        
        clone.json().then((data: any) => {
          //  console.log("Check Data:", data);
           
           if (data.state === 'SUCCESS') {
             console.log(" JUDGEMENT COMPLETE:", data.status_msg);
             
             realWindow.dispatchEvent(new CustomEvent('leetcode-submission', { 
               detail: { 
                 status: data.status_code,
                 msg: data.status_msg,
                 correct: data.total_correct,
                 total: data.total_testcases
               } 
             }));
           }
        }).catch((err: any) => console.error("Interceptor JSON Error", err));

        return response;

      } catch (err) {
        console.error("Interceptor Network Error", err);
      }
    }

    return originalFetch(...args);
  };
}


