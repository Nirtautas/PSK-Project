import {
    Button,
    Container,
    Typography,
    Paper,
    Box,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function LandingPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
            {/* Hero Section */}
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Worth boards, worth your time!
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Get started for free!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    href="/register"
                    sx={{ mt: 2 }}
                >
                    Get Started
                </Button>
            </Paper>

            {/* Features Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    What you get
                </Typography>
                <Grid container wrap="nowrap" spacing={4}>
                    <Grid sx={{ xs: 12, md: 4 }}>
                        <Box textAlign="center">
                            <DashboardIcon sx={{ fontSize: 50, mb: 1 }} color="primary" />
                            <Typography variant="h6">Create Boards</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Organize your goals and tasks visually with flexible boards.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid sx={{ xs: 12, md: 4 }}>
                        <Box textAlign="center">
                            <GroupIcon sx={{ fontSize: 50, mb: 1 }} color="primary" />
                            <Typography variant="h6">Collaborate Easily</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Invite team members to work together in real-time.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid sx={{ xs: 12, md: 4 }}>
                        <Box textAlign="center">
                            <CheckCircleOutlineIcon sx={{ fontSize: 50, mb: 1 }} color="primary" />
                            <Typography variant="h6">Track Progress</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Stay on top of what's to do, what's in progress, and what's done.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* About Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Who are we?
                    </Typography>
                    <Typography variant="body1" color="textSecondary" maxWidth="sm" sx={{ margin: "0 auto", mt: 2 }}>
                        We're a passionate team of developers focused on building tools that
                        help people stay organized, productive, and confident in what they do.
                        <br /><br />
                        We believe in simplicity, speed, and giving users full control over
                        how they manage their time and work. Our goal is to turn chaotic to-do
                        lists into a clear, structured workflow that actually feels rewarding.
                        <br /><br />
                        Whether you're managing a personal project or collaborating with a team,
                        Worth Manager is designed to make every step feel, well, worth it.
                    </Typography>
                </Box>
            </Paper>

            {/* How It Works Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                How It Works
            </Typography>
            <Grid container spacing={6} direction="column">
                {/* Step 1 */}
                <Grid>
                <Typography variant="h6" gutterBottom>
                    1. Sign up and create your first board
                </Typography>
                <Box
                    component="img"
                    src="/gifs/create-board.gif"
                    alt="Step 1 - Create board"
                    sx={{ width: '100%', borderRadius: 2, display: 'block', mx: 'auto' }}
                />
                </Grid>

                {/* Step 2 */}
                <Grid>
                <Typography variant="h6" gutterBottom>
                    2. Add tasks and assign team members
                </Typography>
                <Box
                    component="img"
                    src="/gifs/add-task.gif"
                    alt="Step 2 - Add tasks and assign"
                    sx={{ width: '100%', borderRadius: 2, display: 'block', mx: 'auto' }}
                />
                </Grid>

                {/* Step 3 */}
                <Grid>
                <Typography variant="h6" gutterBottom>
                    3. Drag and drop cards between stages: To Do, In Progress, Done
                </Typography>
                <Box
                    component="img"
                    src="/gifs/move-task.gif"
                    alt="Step 3 - Drag and drop tasks"
                    sx={{ width: '100%', borderRadius: 2, display: 'block', mx: 'auto' }}
                />
                </Grid>
            </Grid>
            </Paper>


        </Container>
    );
}
