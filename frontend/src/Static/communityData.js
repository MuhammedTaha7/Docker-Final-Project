// communityData.js
import Friends from "../Assets/1.png";
import Groups from "../Assets/2.png";
import Market from "../Assets/3.png";
import Watch from "../Assets/4.png";
import Memories from "../Assets/5.png";

import JobBoard from "../Assets/Icons/Job.png";
import Resume from "../Assets/Icons/CV.png";
import Applications from "../Assets/Icons/Applications.png";
import Saved from "../Assets/Icons/Bookmark.png";

// ==============================
// User & Profile Data
// ==============================
export const currentUser = {
  id: 1,
  name: "Muhammed Taha",
  profilePic:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
};

export const users = [
  {
    id: 1,
    name: "Muhammed Taha",
    profilePic: currentUser.profilePic,
  },
  {
    id: 2,
    name: "Amelia Clark",
    profilePic:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: 3,
    name: "Ethan Lee",
    profilePic:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  },
  {
    id: 4,
    name: "Grace Hall",
    profilePic:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
  },
  {
    id: 5,
    name: "Jane Smith",
    profilePic:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  },
  {
    id: 6,
    name: "Ahmed Ali",
    profilePic:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
  },
  {
    id: 7,
    name: "Emily Clark",
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 8,
    name: "James Miller",
    profilePic:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
  {
    id: 11,
    name: "Lina Bar",
    profilePic:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
  },
  {
    id: 12,
    name: "Adam Ron",
    profilePic:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
  {
    id: 13,
    name: "Noa Klein",
    profilePic:
      "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
  },
  {
    id: 14,
    name: "Maya Levi",
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
];

// Helper function to get user by ID
const getUserById = (id) => users.find((user) => user.id === id);

// ==============================
// Posts (Feed / Profile) - EXPANDED WITH MORE POSTS
// ==============================
export const mockPosts = [
  // Current user's post
  {
    id: 1,
    name: currentUser.name,
    userId: currentUser.id,
    profilePic: currentUser.profilePic,
    desc: "Excited to share my new project with you all!",
    img: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    role: "Student",
  },

  // Posts for suggested friends (so their profiles won't be empty)
  {
    id: 11,
    name: "Lina Bar",
    userId: 11,
    profilePic:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    desc: "Psychology student here! Just finished my research on social behavior patterns. Anyone interested in discussing findings?",
    img: "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg",
    role: "Student",
  },
  {
    id: 12,
    name: "Lina Bar",
    userId: 11,
    profilePic:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    desc: "Beautiful sunset today! Sometimes we need to take a break from studies and enjoy nature 🌅",
    img: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg",
    role: "Student",
  },

  {
    id: 13,
    name: "Adam Ron",
    userId: 12,
    profilePic:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    desc: "Cybersecurity tip of the day: Always use two-factor authentication! Your digital safety is crucial 🔐",
    img: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    role: "Lecturer",
  },
  {
    id: 14,
    name: "Adam Ron",
    userId: 12,
    profilePic:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    desc: "Teaching ethical hacking today. Remember: knowledge is power, but with great power comes great responsibility!",
    role: "Lecturer",
  },

  {
    id: 15,
    name: "Noa Klein",
    userId: 13,
    profilePic:
      "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    desc: "Working on a new mobile app! React Native is amazing for cross-platform development 📱💻",
    img: "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg",
    role: "Student",
  },
  {
    id: 16,
    name: "Noa Klein",
    userId: 13,
    profilePic:
      "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    desc: "Coffee + Code = Perfect combination ☕👩‍💻 Anyone else coding late tonight?",
    img: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg",
    role: "Student",
  },

  {
    id: 17,
    name: "Maya Levi",
    userId: 14,
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    desc: "Just launched our marketing campaign! The power of social media storytelling is incredible 📈✨",
    img: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
    role: "Student",
  },
  {
    id: 18,
    name: "Maya Levi",
    userId: 14,
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    desc: "Attending marketing seminar today. Learning about digital transformation strategies 📊",
    role: "Student",
  },
  {
    id: 19,
    name: "Emily Clark",
    userId: 7,
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    desc: "Just graduated! Looking forward to starting my career in tech 🎓✨",
    img: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
    role: "Graduate",
  },
  {
    id: 20,
    name: "Emily Clark",
    userId: 7,
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    desc: "Working on my portfolio website. Any feedback would be appreciated! 💻",
    img: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    role: "Graduate",
  },

  // James Miller posts
  {
    id: 21,
    name: "James Miller",
    userId: 8,
    profilePic:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    desc: "Weekend hiking trip! Nature is the best stress reliever 🏔️🥾",
    img: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg",
    role: "Student",
  },
  {
    id: 22,
    name: "James Miller",
    userId: 8,
    profilePic:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    desc: "Studying for finals. Coffee is my best friend right now ☕📚",
    img: "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg",
    role: "Student",
  },

  // Keep Jane Smith and Ahmed Ali posts but they should only show when they become friends
  {
    id: 2,
    name: users[4].name,
    userId: users[4].id,
    profilePic: users[4].profilePic,
    desc: "Loving the view from here 🏞️",
    img: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg",
    role: "Student",
  },
  {
    id: 3,
    name: users[5].name,
    userId: users[5].id,
    profilePic: users[5].profilePic,
    desc: "Any React devs here? Let's connect!",
    img: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    role: "Lecturer",
  },
];

// ==============================
// Groups & Group Posts
// ==============================
export const groupsList = [
  {
    id: 1,
    name: "AI & Machine Learning Club",
    description:
      "Discuss ML papers, share projects, and collaborate on AI challenges.",
    members: 112,
    type: "Public",
    img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    founderId: 2,
    membersList: [
      { id: 2, name: "Amelia Clark", role: "Founder", joinDate: "2023-01-15" },
      { id: 3, name: "Ethan Lee", role: "Co-founder", joinDate: "2023-02-10" },
      { id: 1, name: "Muhammed Taha", role: "Member", joinDate: "2023-03-20" },
    ],
  },
  {
    id: 2,
    name: "YVC Engineering Department",
    description: "Official group for engineering students and faculty at YVC.",
    members: 58,
    type: "Private",
    img: "https://images.pexels.com/photos/256658/pexels-photo-256658.jpeg",
    founderId: 4,
    membersList: [
      { id: 4, name: "Grace Hall", role: "Founder", joinDate: "2023-04-01" },
      { id: 5, name: "Jane Smith", role: "Member", joinDate: "2023-05-12" },
    ],
  },
  {
    id: 3,
    name: "Women in Tech - YVC",
    description:
      "Empowering women in STEM fields through mentorship and support.",
    members: 84,
    type: "Public",
    img: "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg",
    founderId: 5,
    membersList: [
      { id: 5, name: "Jane Smith", role: "Founder", joinDate: "2023-04-05" },
    ],
  },
];

export let localGroupsList = JSON.parse(JSON.stringify(groupsList));

// Fixed group posts structure to match the Posts component expectations
export const groupPosts = {
  1: [
    {
      id: 101,
      name: "Ethan Lee",
      userId: 3,
      profilePic: getUserById(3).profilePic,
      desc: "Check out this cool ML paper I found! 📚 Who wants to discuss the latest advances in neural networks?",
      img: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
      role: "Student",
      date: "2h ago",
    },
    {
      id: 102,
      name: "Muhammed Taha",
      userId: 1,
      profilePic: getUserById(1).profilePic,
      desc: "Does anyone want to collaborate on a YOLO project? I'm working on object detection for my final project and would love some teammates! 🤖",
      img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      role: "Student",
      date: "1d ago",
    },
    {
      id: 103,
      name: "Amelia Clark",
      userId: 2,
      profilePic: getUserById(2).profilePic,
      desc: "Great discussion in today's AI ethics seminar! The intersection of technology and society is fascinating. What are your thoughts on responsible AI development?",
      role: "Student",
      date: "2d ago",
    },
  ],
  2: [
    {
      id: 201,
      name: "Grace Hall",
      userId: 4,
      profilePic: getUserById(4).profilePic,
      desc: "Reminder: Engineering meetup this Thursday at 4 PM in the main auditorium. We'll be discussing career opportunities and networking! 🏗️",
      role: "Student",
      date: "3h ago",
    },
    {
      id: 202,
      name: "Jane Smith",
      userId: 5,
      profilePic: getUserById(5).profilePic,
      desc: "Just finished grading your midterm projects - impressed by the creativity and technical skills demonstrated! Keep up the excellent work! 👏",
      role: "Lecturer",
      date: "5h ago",
    },
  ],
  3: [
    {
      id: 301,
      name: "Jane Smith",
      userId: 5,
      profilePic: getUserById(5).profilePic,
      desc: "Excited to announce our upcoming mentorship program! Senior women in tech will be paired with junior students. Applications open next week! 💪👩‍💻",
      img: "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg",
      role: "Lecturer",
      date: "4h ago",
    },
  ],
};

export let localGroupPosts = JSON.parse(JSON.stringify(groupPosts));

// ==============================
// Friends Page - INITIAL FRIENDS (EMPTY TO START)
// ==============================
export const friendsList = [
  // Start with empty friends list - users will add friends through suggestions
];

// ==============================
// Suggested Friends
// ==============================
export const suggestedFriends = [
  {
    id: 11,
    name: "Lina Bar",
    profilePic:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    role: "Student",
    title: "Psychology, 2nd year",
    university: "Yezreel Valley College",
  },
  {
    id: 12,
    name: "Adam Ron",
    profilePic:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    role: "Lecturer",
    title: "Cyber Security",
    university: "Yezreel Valley College",
  },
  {
    id: 13,
    name: "Noa Klein",
    profilePic:
      "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    role: "Student",
    title: "Software Engineering",
    university: "Yezreel Valley College",
  },
  {
    id: 14,
    name: "Maya Levi",
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    role: "Student",
    title: "Marketing & Media",
    university: "Yezreel Valley College",
  },
  {
    id: 5,
    name: "Jane Smith",
    profilePic:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    role: "Lecturer",
    title: "Software Engineering",
    university: "Yezreel Valley College",
  },
  {
    id: 6,
    name: "Ahmed Ali",
    profilePic:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    role: "Lecturer",
    title: "Data Science & Analytics",
    university: "Yezreel Valley College",
  },
];

// ==============================
// Comments
// ==============================
export const commentUser = currentUser;

export const initialComments = [
  {
    id: 1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    name: users[3].name,
    userId: users[3].id,
    profilePicture: users[3].profilePic,
  },
  {
    id: 2,
    desc: "Another comment here!",
    name: users[2].name,
    userId: users[2].id,
    profilePicture: users[2].profilePic,
  },
];

// ==============================
// Stories - Updated with proper structure and timestamps
// ==============================
export const stories = [
  // Multiple stories from the same user (Amelia Clark)
  {
    id: 2,
    userId: 2,
    name: "Amelia Clark",
    profilePic:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    img: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    type: "image",
    time: "2h ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 21,
    userId: 2,
    name: "Amelia Clark",
    profilePic:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    type: "image",
    time: "4h ago",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },

  // Single story from Ethan Lee
  {
    id: 3,
    userId: 3,
    name: "Ethan Lee",
    profilePic:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    img: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
    type: "image",
    time: "6h ago",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },

  // Multiple stories from Grace Hall
  {
    id: 4,
    userId: 4,
    name: "Grace Hall",
    profilePic:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    img: "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg",
    type: "image",
    time: "1h ago",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Most recent
  },
  {
    id: 41,
    userId: 4,
    name: "Grace Hall",
    profilePic:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    img: "https://images.pexels.com/photos/256658/pexels-photo-256658.jpeg",
    type: "image",
    time: "5h ago",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },

  {
    id: 5,
    userId: 5,
    name: "Jane Smith",
    profilePic:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    img: "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg",
    type: "image",
    time: "8h ago",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    userId: 6,
    name: "Ahmed Ali",
    profilePic:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    img: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    type: "image",
    time: "12h ago",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    userId: 7,
    name: "Emily Clark",
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    img: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
    type: "image",
    time: "1d ago",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },

  // Multiple stories from James Miller
  {
    id: 8,
    userId: 8,
    name: "James Miller",
    profilePic:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    img: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg",
    type: "image",
    time: "3h ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 81,
    userId: 8,
    name: "James Miller",
    profilePic:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    img: "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg",
    type: "image",
    time: "7h ago",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },

  {
    id: 11,
    userId: 11,
    name: "Lina Bar",
    profilePic:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    img: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg",
    type: "image",
    time: "2d ago",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    userId: 12,
    name: "Adam Ron",
    profilePic:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    img: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg",
    type: "image",
    time: "3d ago",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    userId: 13,
    name: "Noa Klein",
    profilePic:
      "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    img: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    type: "image",
    time: "4d ago",
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    userId: 14,
    name: "Maya Levi",
    profilePic:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    img: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
    type: "image",
    time: "5d ago",
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
  },
];

// ... (keep all your existing imports and data the same until activities section)

// ==============================
// RightBar: Friend Requests & Activities - UPDATED WITH REAL FRIEND ACTIVITIES
// ==============================

// Friend Requests (these are different from suggestions)
export const friendRequests = [
  {
    id: 7,
    name: "Emily Clark",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 8,
    name: "James Miller",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
];

// Updated activities based on actual friend posts and actions
export const activities = [
  // Emily Clark activities (she's in friend requests, so these would show when she becomes a friend)
  {
    id: 7,
    name: "Emily Clark",
    action: "shared a new post about graduating",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    time: "2 hours ago",
  },
  {
    id: 71,
    name: "Emily Clark",
    action: "updated her portfolio website",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    time: "5 hours ago",
  },

  // James Miller activities (he's in friend requests)
  {
    id: 8,
    name: "James Miller",
    action: "shared photos from his hiking trip",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    time: "3 hours ago",
  },
  {
    id: 81,
    name: "James Miller",
    action: "posted about studying for finals",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    time: "8 hours ago",
  },

  // Suggested friends activities (these would show when they become friends)
  {
    id: 11,
    name: "Lina Bar",
    action: "shared her psychology research findings",
    img: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    time: "1 hour ago",
  },
  {
    id: 111,
    name: "Lina Bar", 
    action: "posted a beautiful sunset photo",
    img: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    time: "6 hours ago",
  },

  {
    id: 12,
    name: "Adam Ron",
    action: "shared a cybersecurity tip",
    img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    time: "4 hours ago",
  },
  {
    id: 121,
    name: "Adam Ron",
    action: "posted about teaching ethical hacking",
    img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    time: "1 day ago",
  },

  {
    id: 13,
    name: "Noa Klein",
    action: "shared her new React Native app progress", 
    img: "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    time: "30 mins ago",
  },
  {
    id: 131,
    name: "Noa Klein",
    action: "posted about coding late at night",
    img: "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    time: "10 hours ago",
  },

  {
    id: 14,
    name: "Maya Levi",
    action: "launched a new marketing campaign",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    time: "7 hours ago",
  },
  {
    id: 141,
    name: "Maya Levi",
    action: "attended a marketing seminar",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    time: "12 hours ago",
  },

  // Jane Smith activities (suggested friend)
  {
    id: 5,
    name: "Jane Smith",
    action: "commented on Ahmed's React post",
    img: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    time: "25 mins ago",
  },
  {
    id: 51,
    name: "Jane Smith",
    action: "shared a view from a mountain",
    img: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    time: "9 hours ago",
  },

  // Ahmed Ali activities (suggested friend)
  {
    id: 6,
    name: "Ahmed Ali",
    action: "posted about React development",
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    time: "15 mins ago",
  },
  {
    id: 61,
    name: "Ahmed Ali",
    action: "updated his profile picture",
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    time: "2 days ago",
  },

  // Group activities from existing users
  {
    id: 2,
    name: "Amelia Clark",
    action: "posted in AI & Machine Learning Club",
    img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    time: "45 mins ago",
  },
  {
    id: 3,
    name: "Ethan Lee",
    action: "shared a ML paper in the group",
    img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    time: "2 hours ago",
  },
  {
    id: 4,
    name: "Grace Hall",
    action: "announced an engineering meetup",
    img: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    time: "3 hours ago",
  },

  // Current user's activity (this should be filtered out in the component)
  {
    id: 1,
    name: currentUser.name,
    action: "updated their profile picture",
    img: currentUser.profilePic,
    time: "5 mins ago",
  },
];

// ==============================
// Job Board
// ==============================
export const jobPosts = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Remote",
    type: "Internship",
    tags: ["React", "HTML", "CSS"],
    postedDate: "2025-03-25",
    description: "Join our frontend team and build amazing UIs for students.",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataMind",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    tags: ["Python", "SQL", "Pandas"],
    postedDate: "2025-03-20",
    description: "Analyze data and create insightful dashboards.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Hybrid",
    type: "Part-time",
    tags: ["Figma", "Design Thinking"],
    postedDate: "2025-03-21",
    description: "Design user-centered solutions with our team.",
  },
];

export const onlineFriends = [users[1], users[2], users[3], users[4], users[5]];

/*-------------------------- leftBar.js --------------------------*/
export const leftBarMenuItems = [
  { id: 1, icon: Friends, label: "Friends" },
  { id: 2, icon: Groups, label: "Groups" },
  { id: 3, icon: JobBoard, label: "Job Board" },
  { id: 4, icon: Resume, label: "My CV" },
  { id: 5, icon: Saved, label: "Saved Posts" },
];