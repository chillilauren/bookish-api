import fetch from "node-fetch";
import {EditBookRequest} from "../models/requestModels";

const baseUrl = 'https://openlibrary.org/api/';

interface Author {
    name: string;
}

interface Publisher {
    name: string;
}

interface CoverImage {
    small: string | undefined;
    medium: string | undefined;
    large: string | undefined;
}

export const lookupBook = async (isbn: string): Promise<EditBookRequest> => {
    const response = await fetch(`${baseUrl}books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    const jsonData = await response.json();
    const bookData = jsonData[`ISBN:${isbn}`];
    return {
        title: bookData.title,
        author: getAuthors(bookData.authors),
        publishDate: bookData.publish_date || null,
        isbn: isbn,
        publisher: getPublisher(bookData.publishers),
        coverImageUrl: getCoverImage(bookData.cover),
    }
}

const getAuthors = (authors: Author[]): string => {
    return authors.map((author: Author) => author.name).join(", ");
}

const getPublisher = (publishers: Publisher[] | undefined): string | null => {
    if (!publishers || publishers.length === 0) {
        return "";
    }
    return publishers[0].name;
}

const getCoverImage = (coverImage: CoverImage | undefined): string | null => {
    if (!coverImage) {
        return null;
    }
    return coverImage.large || coverImage.medium || coverImage.small || null;
}