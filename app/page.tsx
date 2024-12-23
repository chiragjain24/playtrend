"use client"
import React, { useEffect, useState } from 'react'
import { genreListProps, ResultShowProps } from '@/types/types';
import Carousel from '@/components/Carousel';
import CustomSelect from '@/components/CustomSelect';

const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`
    }
};

const DiscoverPage = () => {
    const [resultShows, setResultShows] = useState<ResultShowProps[]>([]);
    const [showType, setShowType] = useState('movie');
    const [category, setCategory] = useState('trending');
    const [genreList, setGenreList] = useState<genreListProps>({tv:[], movie:[]});
    const [categoryOptions, setcategoryOptions] = useState<{ value: string; label: string; }[]>([]);
    const showTypeOptions = [
        { value: 'movie', label: 'Movie' },
        { value: 'tv', label: 'Web Series' },
      ];

    const fetchShows = async (showType:string, category:string) => {
        try {
            let response;
            if(category === 'trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/${showType}/week?language=en-US`,API_OPTIONS);
            } else{
                response = await fetch(`https://api.themoviedb.org/3/discover/${showType}?with_genres=${category}&language=en-US`,API_OPTIONS);
            }
            const data = await response.json();

            const ids = data.results.map((item:any)=>item.id); // eslint-disable-line
            const fetchPromises = ids.slice(0,16).map((id: number)=>fetchShowDetails(id));
            const shows = (await Promise.all(fetchPromises)).filter((show) => show !== null).slice(0,8);
            setResultShows(shows);
            // console.log(shows);
        } catch (error) {
            console.error(`Error fetching shows:`, error);
        } 
    };

    const fetchGenres = async () => {
        try {
            const responseTv = await fetch(`https://api.themoviedb.org/3/genre/tv/list?language=en-US`,API_OPTIONS);
            const dataTv = await responseTv.json();

            const responseMovie = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en-US`,API_OPTIONS);
            const dataMovie = await responseMovie.json();
            setGenreList({tv: dataTv.genres, movie: dataMovie.genres});
        } catch (error) {
            console.error(`Error fetching genres:`, error);
        }
    }

    const fetchShowDetails = async (id: number) => {
        try{
            const response = await fetch(`https://api.themoviedb.org/3/${showType}/${id}?append_to_response=videos,images`, API_OPTIONS);
            const item = await response.json();
            // console.log(item);
            const logo = item.images.logos.filter((logo:any)=>logo.iso_639_1 === 'en')[0]?.file_path || // eslint-disable-line
                         item.images.logos.filter((logo:any)=>logo.iso_639_1 === 'hi')[0]?.file_path  || // eslint-disable-line
                         item.images.logos[0]?.file_path;
            return {
                id,
                title: item.name || item.title || null,
                image: item.backdrop_path || item.poster_path || null,
                date: item.first_air_date || item.release_date || null,
                year: String(new Date(item.first_air_date || item.release_date)?.getFullYear()),
                stars: item.vote_average?.toFixed(1) || 0,
                typeName: showType==='tv'?'Web Series':'Movie',
                type: showType,
                videos: item.videos.results.filter((video:any)=>video.type === 'Trailer') || [], // eslint-disable-line
                logo,
                description: item.overview,
                genres: item.genres?.map((item:any) => item.name), // eslint-disable-line
            }
        } catch(error){
            console.error(`Error fetching show details:`, error);
            return null;
        }
    }


     useEffect(()=>{
            const options = genreList[showType].map((genre: any) => ({value: genre.id.toString(), label: genre.name})); // eslint-disable-line
            options.unshift({value: 'trending', label: 'Trending'});
            setcategoryOptions(options);
     },[genreList, showType]);
 
     useEffect(()=>{
         fetchShows(showType, category);
     },[showType, category]);
 
     useEffect(()=>{
        fetchGenres();
     },[]);
    
  return (
    <>
        <div className='absolute top-6 z-50 left-0 right-0 flex gap-6 w-fit mx-auto max-lg:top-12'>
            <CustomSelect
                options={showTypeOptions}
                value={showType}
                onChange={setShowType}
                placeholder="Movie"
                disabled={false}
                className="w-[150px]"
            />
            <CustomSelect
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="Trending"
                disabled={false}
                className="w-[150px]"
            />
        </div>

        <Carousel shows={resultShows} />
    
    </>
  )
}

export default DiscoverPage