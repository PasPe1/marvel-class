import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

    const [char, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

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

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
        // setError(false)
    }


    const onCharLoaded = (newChar) => {
        let ended = false
        if (newChar.length < 9) {
            ended = true;
        }

        console.log(char);
        
        setCharList(char => [...char, ...newChar]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    // const onLoadChar = () => {
    //     this.onRequest();
    // }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach( item => {item.classList.remove("char__item_selected")});
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(char) {
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
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {props.onCharSelected(item.id)
                                    focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
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



    
    

    const items = renderItems(char);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner  = loading && !newItemLoading ? <Spinner/>: null
    // const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
        {/* <ul className="char__grid"> */}
            {errorMessage}
            {spinner}
            {items}
        {/* </ul> */}
        <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
            <div className="inner">load more</div>
        </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

//