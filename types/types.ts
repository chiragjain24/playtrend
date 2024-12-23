export type ResultShowProps = {
    id: number;
    title: string;
    image: string;
    date: string;
    year: string;
    stars: string;
    typeName: string;
    type: string;
    videos: any[]; // eslint-disable-line
    logo: string;
    description: string;
    genres: string[];
}
  
export type genreListProps = {
    [key: string]: {id: number, name: string}[];
}