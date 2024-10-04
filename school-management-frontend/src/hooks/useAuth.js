import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VERIFY_TOKEN = gql`
   query ValidateToken {
    validateToken {
      token
    }
  }
`

export const useAuth = () => {
  const navigate = useNavigate();
  const { error } = useQuery(VERIFY_TOKEN)

  useEffect(() => {
    if ((error && error.message === 'Not authenticated') || !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [error, navigate])

}