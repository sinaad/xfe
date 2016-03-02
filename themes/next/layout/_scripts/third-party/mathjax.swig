{% if theme.mathjax %}
  <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        processEscapes: true
      }
    });
  </script>

  <script type="text/x-mathjax-config">
      MathJax.Hub.Config({
        tex2jax: {
          skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        }
      });
      MathJax.Hub.Register.MessageHook("Math Processing Error",function (message) {
        //  do something with the error.  message[2] is the Error object that records the problem.
        console.log(message);
      });
  </script>

  <script type="text/x-mathjax-config">
      MathJax.Hub.Queue(function() {
          var all = MathJax.Hub.getAllJax(), i;
          for(i=0; i < all.length; i += 1) {
              all[i].SourceElement().parentNode.className += ' has-jax';
          }
      });
  </script>

  <script type="text/javascript" src="//cdn.bootcss.com/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
{% endif %}
