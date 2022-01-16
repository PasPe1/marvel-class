import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onLoadChar()
        // window.addEventListener('scroll', this.handleScroll);
    }

    // handleScroll = () => {
    //     // console.log(window.innerHeight);
    //     // console.log(document.body.scrollHeight);
    //     // console.log(document.documentElement.scrollTop);
    //     if (document.body.scrollHeight <= window.innerHeight + document.documentElement.scrollTop) {
    //         this.onRequest(this.state.offset)
    //         console.log('yes');
    //         console.log(this.state.charEnded)
    //     }
    //     };

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
        this.setState({
            error: false
        })
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onCharLoaded = (newChar) => {
        let ended = false
        if (newChar.length < 9) {
            ended = true;
        }


        this.setState(({offset, char}) => ({
            char: [...char, ...newChar],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onLoadChar = () => {
        this.onRequest();
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref);
        console.log(ref)
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach( item => {item.classList.remove("char__item_selected")});
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (char) => {
        const items = char.map((item, i) => {

            let imgStyle = {'objectFit' : 'cover'}
            if (char[0].thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'contain'}
        }
    
    
        return (
            <li 
                    className="char__item"
                    tabIndex={0}
                    key={item.id}
                    ref = {this.setRef}
                    onClick={() => {this.props.onCharSelected(item.id)
                                    this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id)
                            this.focusOnItem(i)
                        }
                    }}>
                        <img src={item.thumbnail} alt="item.name" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
        )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }



    render() {
        const {char, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(char);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner  = loading ? <Spinner/>: null
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {content}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;

//