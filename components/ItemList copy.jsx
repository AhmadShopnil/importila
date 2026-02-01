// "use client"

// import DesignCard from "./DesignCard"

// const PRODUCT_DATA = {
//   boys: [
//     {
//       id: "b1",
//       name: "Space Adventure",
//       description: "Cosmic-themed t-shirt with matching pants",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/space-adventure-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Navy", hex: "#001F3F" },
//         { id: "c2", name: "Black", hex: "#000000" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "b2",
//       name: "Dinosaur Kingdom",
//       description: "Fun dinosaur prints for young explorers",
//       fabric: "95% Cotton, 5% Elastane",
//       printType: "Digital Print",
//       image: "/dinosaur-kids-t-shirt.jpg",
//       colors: [
//         { id: "c1", name: "Green", hex: "#2ECC40" },
//         { id: "c2", name: "Brown", hex: "#8B4513" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//     {
//       id: "b3",
//       name: "Sports Champ",
//       description: "Active wear inspired designs",
//       fabric: "100% Cotton",
//       printType: "Embroidered",
//       image: "/sports-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Red", hex: "#FF4136" },
//         { id: "c2", name: "Blue", hex: "#0074D9" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "b4",
//       name: "Ocean Explorer",
//       description: "Sea-themed adventure set",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/ocean-sea-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Light Blue", hex: "#007FFF" },
//         { id: "c2", name: "Teal", hex: "#008080" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "b5",
//       name: "Superhero Squad",
//       description: "Bold superhero-inspired designs",
//       fabric: "95% Cotton, 5% Elastane",
//       printType: "Digital Print",
//       image: "/superhero-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Red", hex: "#FF4136" },
//         { id: "c2", name: "Yellow", hex: "#FFDC00" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//     {
//       id: "b6",
//       name: "Jungle Vibes",
//       description: "Wild animal-themed set",
//       fabric: "100% Cotton",
//       printType: "Sublimation",
//       image: "/jungle-animals-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Khaki", hex: "#C3B091" },
//         { id: "c2", name: "Dark Green", hex: "#355C3D" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "b7",
//       name: "Tech Geek",
//       description: "Modern robot and gadget design",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/robot-tech-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Silver", hex: "#C0C0C0" },
//         { id: "c2", name: "Charcoal", hex: "#36454F" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//     {
//       id: "b8",
//       name: "Music Master",
//       description: "Fun musical instruments print",
//       fabric: "95% Cotton, 5% Elastane",
//       printType: "Digital Print",
//       image: "/music-instruments-kids-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Purple", hex: "#B10DC9" },
//         { id: "c2", name: "Orange", hex: "#FF851B" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//   ],
//   girls: [
//     {
//       id: "g1",
//       name: "Butterfly Dreams",
//       description: "Colorful butterfly-themed set",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/butterfly-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Pink", hex: "#FF69B4" },
//         { id: "c2", name: "Purple", hex: "#B10DC9" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "g2",
//       name: "Princess Crown",
//       description: "Royal-inspired comfortable set",
//       fabric: "95% Cotton, 5% Elastane",
//       printType: "Digital Print",
//       image: "/princess-crown-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Gold", hex: "#FFD700" },
//         { id: "c2", name: "Pink", hex: "#FFB6C1" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//     {
//       id: "g3",
//       name: "Rainbow Vibes",
//       description: "Bright and cheerful multi-color design",
//       fabric: "100% Cotton",
//       printType: "Sublimation",
//       image: "/rainbow-colorful-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Multi", hex: "#FFFF00" },
//         { id: "c2", name: "Pastel", hex: "#FFC0CB" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "g4",
//       name: "Unicorn Magic",
//       description: "Magical unicorn-themed design",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/unicorn-magic-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Pink", hex: "#FF69B4" },
//         { id: "c2", name: "Lavender", hex: "#E6E6FA" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "g5",
//       name: "Mermaid Tales",
//       description: "Ocean mermaid adventure set",
//       fabric: "95% Cotton, 5% Elastane",
//       printType: "Digital Print",
//       image: "/mermaid-ocean-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Turquoise", hex: "#40E0D0" },
//         { id: "c2", name: "Sea Blue", hex: "#008080" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//     {
//       id: "g6",
//       name: "Flower Garden",
//       description: "Beautiful flower-inspired design",
//       fabric: "100% Cotton",
//       printType: "Sublimation",
//       image: "/flower-garden-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Rose", hex: "#FF007F" },
//         { id: "c2", name: "Coral", hex: "#FF7F50" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y", "7-8Y"],
//     },
//     {
//       id: "g7",
//       name: "Starlight Wonder",
//       description: "Dreamy star and moon design",
//       fabric: "100% Cotton",
//       printType: "Screen Print",
//       image: "/stars-moon-girls-clothing.jpg",
//       colors: [
//         { id: "c1", name: "Navy", hex: "#001F3F" },
//         { id: "c2", name: "Pale Blue", hex: "#ADD8E6" },
//       ],
//       sizes: ["1-2Y", "3-4Y", "5-6Y"],
//     },
//   ],
// }

// export default function ItemList({ category, onItemUpdate, selectedItems }) {
//   const designs = PRODUCT_DATA[category] || []

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-foreground">Available Designs ({designs.length})</h2>

//       <div className="grid gap-6 md:grid-cols-2">
//         {designs.map((design) => (
//           <DesignCard
//             key={design.id}
//             design={design}
//             onItemUpdate={onItemUpdate}
//             selectedItems={selectedItems}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
