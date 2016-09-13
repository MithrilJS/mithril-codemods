m.request({ method: 'GET', url: 'https://api.github.com/' })
    .then(function (responseBody) {
        return m.request({ method: 'GET', url: responseBody.emojis_url });
    })
    .then(function (emojis) {
        console.log("+1 url:", emojis['+1']);
    });
