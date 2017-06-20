/* jshint esversion: 6 */
(function ( window, document, $ ) {
    'use strict';

    const postsUrl = 'http://wp-api-demo.dev/wp-json/wp/v2/posts?context=embed';
    const postsContainer = document.getElementById( 'posts' );
    const timer = document.getElementById( 'timer' );
    const postFrag = document.createDocumentFragment();

    /**
     * Create the HTML for individual posts.
     * @param {Object} post The WordPress post JSON object.
     */
    function buildPost( post ) {
        // Build the container for the single post.
        let postContainer = document.createElement( 'article' );
        postContainer.classList.add( post.type, 'post-' + post.id );

        // Build the Title
        let postHeading = document.createElement( 'h2' );
        postHeading.innerHTML = post.title.rendered;
        postContainer.appendChild( postHeading );

        // Build the Excerpt
        let postExcerpt = document.createElement( 'div' );
        postExcerpt.classList.add( 'excerpt' );
        postExcerpt.innerHTML = post.excerpt.rendered;
        postContainer.appendChild( postExcerpt );

        // Add this post to the fragment
        postFrag
            .appendChild( postContainer )
            .appendChild( postExcerpt );
    }

    /**
     * Get posts from WP REST API using jQuery Ajax.
     *
     * @link http://api.jquery.com/jQuery.get/
     */
    function getPosts() {
        const start = performance.now();
        console.time( 'getPosts' );

        $.get( postsUrl, function parseGetResponse( response ) {
            console.log( this );
            console.log( response );

            response.forEach( function postBuilder( post ) {
                buildPost( post );
            } );

            // Add fragment to the parent container
            postsContainer.appendChild( postFrag );
        }, 'json' );

        const end = performance.now();
        console.timeEnd( 'getPosts' );

        timer.innerText = parseFloat( end - start ).toFixed( 4 ) + 'ms';
    }

    /**
     * Get posts from the WP REST API using the Fetch API and Promises.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
     */
    function fetchPosts() {
        const start = performance.now();
        console.time( 'fetchPosts' );

        fetch( postsUrl )
            .then( function parseFetchResponse( response ) {
                console.log( response );
                if ( response.ok ) {
                    return response.json();
                }

                throw new Error( response.status + ' - ' + response.statusText );
            } )
            .then( function promiseCB( posts ) {
                posts.forEach( function postBuilder( post ) {
                    buildPost( post );
                } );

                // Add fragment to the parent container
                postsContainer.appendChild( postFrag );
            } )
            .catch( function catchCB( error ) {
                console.error( 'There was a problem fetching posts: %s', error.message );
            } );

        const end = performance.now();
        console.timeEnd( 'fetchPosts' );

        timer.innerText = parseFloat( end - start ).toFixed( 4 ) + 'ms';
    }

    document.getElementById( 'get' ).addEventListener( 'click', getPosts );
    document.getElementById( 'fetch' ).addEventListener( 'click', fetchPosts );

})( window, document, jQuery, null );
