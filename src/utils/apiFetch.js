async function refreshAccessToken() {

    const refresh =
        localStorage.getItem(
            "refreshToken"
        );

    const res =
        await fetch(
            "http://localhost:8089/api/auth/refresh",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        refreshToken:
                            refresh

                    })

            }

        );

    if (!res.ok) {

        throw new Error();

    }

    const data =
        await res.json();

    localStorage.setItem(

        "accessToken",

        data.accessToken

    );

    return data.accessToken;

}



export async function apiFetch(
  url,
  options = {}
) {

  const token =
    localStorage.getItem(
      "accessToken"
    );

  const headers = {
    Authorization:
      token
        ? `Bearer ${token}`
        : ""
  };

  // ONLY JSON requests
  if (
    !(
      options.body instanceof FormData
    )
  ) {
    headers[
      "Content-Type"
    ] =
      "application/json";
  }

  return fetch(
    url,
    {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    }
  );
}