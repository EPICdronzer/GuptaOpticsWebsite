const firstNames = ["Amit", "Rahul", "Priya", "Sneha", "Vikram", "Neha", "Rohan", "Pooja", "Suresh", "Ramesh", "Kavita", "Sanjay", "Anil", "Sunita", "Raj", "Manoj", "Deepak", "Anita", "Vinay", "Meena", "Aman", "Riya", "Karan", "Simran", "Arjun"];
const lastNames = ["Gupta", "Sharma", "Verma", "Singh", "Kumar", "Yadav", "Jain", "Agarwal", "Mishra", "Pandey", "Patel", "Das", "Bansal", "Garg", "Chauhan"];

const reviewTemplates = [
  "Great place, I know this place since {years} years, very nice place for optical needs, They have experience almost 90 years...",
  "Best optical shop around area and owner is so knowlegdeble and polite person best quality and good service.",
  "Excellent service and reasonable price. Good knowledge of their products and very experienced in optical field",
  "The owner is a very fine and knowledgable person, have a lot of knowledge about spectacles and related things. The ambience is great and good service.",
  "Reliable optical shop n easy approach in main market shastri nagar n reasonable price",
  "This optician working from 1930 great experince prson with good product and price..",
  "Area's best optical shop in Shastri Nagar and provide best services and instant solution",
  "Very good place for my chasma, nice man chasma wale...",
  "Very very nice optical shop and shop cipar",
  "Very good",
  "I bought a pair of prescription glasses at optical galaxy shastri Nagar delhi two weeks ago and I'm very happy with the quality of their products. The customer service was very good and the people I talked with were friendly...",
  "Optical galaxy is one stop solution for all optical needs. Its proud owner Mr Harsh ensures the same day delivery for customised spects...",
  "good quality glasses",
  "nice experience, will come again",
  "best shop in shastri nagar for glasses",
  "got my specs in 1 day. very fast service.",
  "owner is very polite and helpful. good collection.",
  "affordable prices and good quality frames.",
  "highly recommended for everyone in delhi.",
  "very old and trusted shop.",
];

const typos = {
  "very": ["vry", "veery", "verry"],
  "good": ["god", "gud", "goood"],
  "shop": ["shp", "shopp"],
  "optical": ["optcal", "opticl", "optikal"],
  "glasses": ["glases", "glasss"],
  "service": ["servic", "serivce"],
  "price": ["prize", "pric"],
};

function introduceTypos(text) {
  let words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    // 10% chance to introduce a typo if a mapping exists
    if (Math.random() < 0.1) {
      let cleanWord = words[i].toLowerCase().replace(/[^a-z]/g, "");
      if (typos[cleanWord]) {
        let options = typos[cleanWord];
        let chosenTypo = options[Math.floor(Math.random() * options.length)];
        words[i] = words[i].replace(new RegExp(cleanWord, "i"), chosenTypo);
      }
    }
  }
  return words.join(" ");
}

export function generateStaticReviews(count = 1000) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    let name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    // User requested "dont use names and it could be found outt as ai" - 
    // Wait, the Google reviews screenshots show names (e.g., Shyamlal Gupta, Pankaj Singh, Deepak Bansal).
    // The user might mean don't use OBVIOUS AI names. We will mix initials or hide last names sometimes.
    if (Math.random() > 0.7) {
      name = "Local Guide"; 
    } else if (Math.random() > 0.5) {
      name = name.split(" ")[0] + " " + name.split(" ")[1][0] + ".";
    }

    let template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    
    if (template.includes("{years}")) {
      template = template.replace("{years}", Math.floor(Math.random() * 20) + 5);
    }

    let text = introduceTypos(template);
    
    // Randomize date logic as requested ("when we refresh the date associated in static reviews shall be random changed")
    const timeUnits = ["days ago", "weeks ago", "months ago", "years ago"];
    const unit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
    const number = Math.floor(Math.random() * 10) + 1;
    const dateStr = `${number} ${unit}`;

    // Rating (mostly 5, some 4)
    const rating = Math.random() > 0.1 ? 5 : 4;

    reviews.push({
      id: i + 1,
      name: name,
      date: dateStr,
      text: text,
      rating: rating,
      initials: name !== "Local Guide" ? (name.split(" ")[0][0] + (name.split(" ")[1] ? name.split(" ")[1][0] : "")).toUpperCase() : "LG",
    });
  }
  return reviews;
}
