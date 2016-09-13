m.request({ method: 'GET', url: 'https://api.github.com/' }).run(function (responseBody) {
        return m.request({ method: 'GET', url: responseBody.emojis_url });
    }).run(function (emojis) {
        console.log("+1 url:", emojis['+1']);
    });
