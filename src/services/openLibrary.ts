import fetch from "node-fetch";
import {CreateBookRequest} from "../models/requestModels";

const baseUrl = 'https://openlibrary.org/api/';

interface Author {
    name: string;
}

export const lookupBook = async (isbn: string): Promise<CreateBookRequest> => {
    const response = await fetch(`${baseUrl}books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    const jsonData = await response.json();
    const bookData = jsonData[`ISBN:${isbn}`];
    return {
        title: bookData.title,
        author: bookData.authors.map((author: Author) => author.name).join(", "),
        publishDate: bookData.publish_date,
        isbn: isbn,
        publisher: bookData.publishers[0].name,
        coverImageUrl: bookData.cover.large,
    }
}