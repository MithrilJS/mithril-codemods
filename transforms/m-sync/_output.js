m.prop.merge([
    m.request({ method: 'GET', url: 'https://api.github.com/users/lhorie' }),
    m.request({ method: 'GET', url: 'https://api.github.com/users/isiahmeadows' }),
]).run(function (users) {
        console.log("Contributors:", users[0].name, "and", users[1].name);
    });
