
package com.example.myvideoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Video(
    val title: String,
    val channel: String,
    val views: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                VideoApp()
            }
        }
    }
}

@Composable
fun VideoApp() {

    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "PlayVideo",
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.Search, "Search")
                    }

                    IconButton(onClick = {}) {
                        Icon(Icons.Default.Notifications, "Notifications")
                    }
                }
            )
        },

        bottomBar = {
            NavigationBar {

                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = {
                        Icon(Icons.Default.Home, "Home")
                    },
                    label = { Text("Home") }
                )

                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = {
                        Icon(Icons.Default.PlayArrow, "Shorts")
                    },
                    label = { Text("Shorts") }
                )

                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = {
                        Icon(Icons.Default.AddCircle, "Upload")
                    },
                    label = { Text("Create") }
                )

                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = {
                        Icon(Icons.Default.Person, "Profile")
                    },
                    label = { Text("Profile") }
                )
            }
        }
    ) { padding ->

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {

            when (selectedTab) {

                0 -> HomeScreen()

                1 -> ShortsScreen()

                2 -> UploadScreen()

                3 -> ProfileScreen()
            }
        }
    }
}

@Composable
fun HomeScreen() {

    val videos = listOf(
        Video("Amazing Village Vlog", "Sabuj Vlogs", "1.2K views"),
        Video("Beautiful Nature Video", "Travel Bangla", "5.4K views"),
        Video("My First Vlog", "Sabuj Maity", "2.8K views"),
        Video("Best Street Food", "Food Bangla", "10K views"),
        Video("Free Fire Gameplay", "Gaming Zone", "25K views")
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize()
    ) {

        item {

            LazyRow(
                modifier = Modifier.padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                items(
                    listOf(
                        "All",
                        "Music",
                        "Gaming",
                        "Vlogs",
                        "Live",
                        "Shorts"
                    )
                ) { category ->

                    AssistChip(
                        onClick = {},
                        label = {
                            Text(category)
                        }
                    )
                }
            }
        }

        items(videos) { video ->

            VideoCard(video)
        }
    }
}

@Composable
fun VideoCard(video: Video) {

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(bottom = 18.dp)
    ) {

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(210.dp)
                .background(Color.DarkGray),
            contentAlignment = Alignment.Center
        ) {

            Icon(
                imageVector = Icons.Default.PlayCircle,
                contentDescription = "Play",
                tint = Color.White,
                modifier = Modifier.size(65.dp)
            )
        }

        Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.Top
        ) {

            Icon(
                Icons.Default.AccountCircle,
                contentDescription = "Channel",
                modifier = Modifier.size(45.dp)
            )

            Spacer(modifier = Modifier.width(10.dp))

            Column {

                Text(
                    video.title,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    video.channel,
                    color = Color.Gray
                )

                Text(
                    video.views,
                    color = Color.Gray
                )
            }
        }
    }
}

@Composable
fun ShortsScreen() {

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black),
        contentAlignment = Alignment.Center
    ) {

        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Icon(
                Icons.Default.PlayCircle,
                contentDescription = "Short",
                tint = Color.White,
                modifier = Modifier.size(80.dp)
            )

            Spacer(modifier = Modifier.height(15.dp))

            Text(
                "Shorts",
                color = Color.White,
                fontSize = 25.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(20.dp))

            Row {

                IconButton(onClick = {}) {
                    Icon(
                        Icons.Default.Favorite,
                        "Like",
                        tint = Color.White
                    )
                }

                IconButton(onClick = {}) {
                    Icon(
                        Icons.Default.Comment,
                        "Comment",
                        tint = Color.White
                    )
                }

                IconButton(onClick = {}) {
                    Icon(
                        Icons.Default.Share,
                        "Share",
                        tint = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun UploadScreen() {

    var title by remember {
        mutableStateOf("")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {

        Text(
            "Create / Upload",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
            value = title,
            onValueChange = {
                title = it
            },
            modifier = Modifier.fillMaxWidth(),
            label = {
                Text("Video title")
            }
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = {},
            modifier = Modifier.fillMaxWidth()
        ) {

            Icon(
                Icons.Default.Upload,
                contentDescription = "Upload"
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text("Select Video")
        }

        Spacer(modifier = Modifier.height(15.dp))

        Button(
            onClick = {},
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Publish Video")
        }
    }
}

@Composable
fun ProfileScreen() {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Icon(
            Icons.Default.AccountCircle,
            contentDescription = "Profile",
            modifier = Modifier.size(110.dp)
        )

        Text(
            "Your Name",
            fontSize = 25.sp,
            fontWeight = FontWeight.Bold
        )

        Text(
            "@username",
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(25.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(30.dp)
        ) {

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("0", fontWeight = FontWeight.Bold)
                Text("Videos")
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("0", fontWeight = FontWeight.Bold)
                Text("Followers")
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("0", fontWeight = FontWeight.Bold)
                Text("Following")
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        Button(
            onClick = {},
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Edit Profile")
        }
    }
}
