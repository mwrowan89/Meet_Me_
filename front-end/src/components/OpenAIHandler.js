import { useEffect, useState } from "react";
import axios from "axios";

const OpenAIHandler = ({ coordinates, onResponse }) => {
  const [fetchLocations, setFetchLocations] = useState(false);

  const constructPrompt = (coordinates) => {
    let prompt =
      "List 3 major cities that are halfway along the route between the provided locations: ";
    coordinates.forEach((coord, index) => {
      if (index > 0) {
        prompt += " and ";
      }
      prompt += `${coord.lat}, ${coord.lng}`;
    });
    prompt +=
      ". Please only respond with the name and state of the cities along with some popular attractions in those specific cities. DO NOT RESPOND WITH ANY CITY THAT IS WITHIN 500 MILES OF THE PROVIDED COORDINATES. Please return in json format and do not respond with leading backticks or json. Please title the array 'cities' with each city having a name key and 'attactions' value with ONLY the titles of local attractions. Please include a 'description' value containing a brief description of the city. EXAMPLE DATA SET(cities{name:'Cleveland', state:'Ohio', attractions:['Rock and Roll Hall of Fame', 'Cleveland Museum of Art', 'Cleveland Metroparks Zoo'], description:'Cleveland is a city in Ohio that is home to the Rock and Roll Hall of Fame, Cleveland Museum of Art, and Cleveland Metroparks Zoo.'})";
    return prompt;
  };

  useEffect(() => {
    const fetchAIResponse = async (prompt) => {
      try {
        const response = await axios.post(
          `http://localhost:9000/api/openai/fetch-response`,
          { prompt },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const parsedResponse = JSON.parse(
          response.data.choices[0].message.content
        );

        onResponse(parsedResponse);

        setFetchLocations(false);
      } catch (error) {
        console.error("Error fetching data from OpenAI:", error);
        setFetchLocations(false);
      }
    };
    if (fetchLocations) {
      if (coordinates.length < 2) {
        console.log("Please add more than two markers.");
        setFetchLocations(false);
        return;
      } else {
        const prompt = constructPrompt(coordinates);
        fetchAIResponse(prompt);
      }
    }
  }, [fetchLocations, coordinates, onResponse]);

  useEffect(() => {
    if (coordinates.length >= 2) {
      setFetchLocations(true);
    }
  }, [coordinates]);

  return null;
};

export default OpenAIHandler;
