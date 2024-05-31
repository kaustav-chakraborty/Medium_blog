import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
    content: string;
    title: string;
    id: number;
    author: {
        name: string;
    };
}

export const useBlog = ({ id }: { id: string }) => {

    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blogs/${id}`, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blogs:", error);
                setLoading(false); // make sure to handle errors by setting loading state to false
            });

    }, [id])

    return {
        loading,
        blog
    }

}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found in localStorage");
            setLoading(false);
            return;
        }
        console.log(token);

        axios.get(`${BACKEND_URL}/api/v1/blogs/bulk`, {
            headers: {
                Authorization: `${token}`
            }
        })
        .then(response => {
            console.log(response);
            setBlogs(response.data.blogs);
            setLoading(false);
            
        })
        .catch(error => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        });
    }, []);


    return {
        loading,
        blogs
    };
};
