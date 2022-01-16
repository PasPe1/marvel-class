class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=949e5fef7bf1ecb0b24547a1ff105352';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transfomCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transfomCharacter(res.data.results[0]);
    }

    _transfomCharacter = (char) => {
        
        let e = null;
        if (char.description.length > 10) {
            e = char.description.slice(0, 220) + '...'
            // console.log(char.description)
        } else {
             e = `Sorry, but description is empty!`
            // console.log(char.description)
        }

        return {
            id: char.id,
            name: char.name,
            description: e,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;