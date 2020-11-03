
var rule = {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.ar', schemes: ['https'] }
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.bo', schemes: ['https'] }
      }),
      new chrome.decalarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.br', schemes: ['https'] }
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.cl', schemes: ['https'] }
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.co', schemes: ['https'] }
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.ec', schemes: ['https'] }
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'articulo.mercadolibre.com.do', schemes: ['https'] }
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
  };
  
  chrome.runtime.onInstalled.addListener(function(details) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
  });

