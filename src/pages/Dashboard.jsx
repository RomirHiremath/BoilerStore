
import React, { useState, useEffect } from 'react';
import { Listing } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ShoppingBag, ArrowRight, Tag, BookOpen, Sofa, Sparkles, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ListingCard from '../components/listings/ListingCard';
import ListingDetailModal from '../components/listings/ListingDetailModal';

// Configuration object for categories
const CATEGORY_CONFIG = {
    textbooks: { 
        name: 'Textbooks', 
        icon: BookOpen, 
        color: 'bg-blue-500 text-white',
        description: 'Course materials & study guides' 
    },
    furniture: { 
        name: 'Furniture', 
        icon: Sofa, 
        color: 'bg-green-500 text-white',
        description: 'Dorm & apartment essentials'
    },
    electronics: { 
        name: 'Electronics', 
        icon: Sparkles, 
        color: 'bg-purple-500 text-white',
        description: 'Tech gadgets & accessories'
    },
    other: { 
        name: 'Other', 
        icon: Tag, 
        color: 'bg-gray-600 text-white',
        description: 'Everything else you need'
    }
};

// Hero section component
const HeroSection = () => (
    <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-12 mb-12"
    >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d0e78a75d_purdue_university_logo.jpeg"
                alt="Purdue Logo"
                className="h-24 mx-auto mb-8 drop-shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
            />
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Boiler
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"> Exchange</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                Your campus marketplace built by Boilermakers, for Boilermakers. 
                Trade safely with verified students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl('CreateListing')}>
                    <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all">
                        <ShoppingBag className="w-6 h-6 mr-3" />
                        Start Selling
                    </Button>
                </Link>
                <Link to={createPageUrl('Browse')}>
                    <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all">
                        Browse Items
                        <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                </Link>
            </div>
        </div>
    </motion.section>
);

// Category grid component
const CategoryGrid = () => (
    <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Popular this week</span>
            </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CATEGORY_CONFIG).map(([key, category], index) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link to={createPageUrl(`Browse?category=${category.name}`)}>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                            <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <category.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                            <p className="text-gray-600 text-sm">{category.description}</p>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    </section>
);

// Stats bar component
const StatsBar = ({ listingsCount }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-12"
    >
        <div className="flex items-center justify-between text-center divide-x divide-gray-200">
            <div className="flex-1 px-4">
                <div className="text-3xl font-bold text-gray-900">{listingsCount}</div>
                <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="flex-1 px-4">
                <div className="text-3xl font-bold text-gray-900">2.4k+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
            </div>
            <div className="flex-1 px-4">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-amber-600">
                    <Star className="w-8 h-8 fill-current" />
                    4.9
                </div>
                <div className="text-sm text-gray-600">Trust Rating</div>
            </div>
        </div>
    </motion.div>
);

// Recent listings section
const RecentListingsSection = ({ listings, isLoading, onViewListing }) => (
    <section>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Fresh from Campus</h2>
                <p className="text-gray-600">Latest items from your fellow Boilermakers</p>
            </div>
            <Link to={createPageUrl('Browse')}>
                <Button variant="ghost" className="text-gray-600 hover:text-black font-medium group">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-2xl h-48 mb-4" />
                        <div className="bg-gray-200 h-4 rounded mb-2" />
                        <div className="bg-gray-200 h-6 rounded w-2/3" />
                    </div>
                ))}
            </div>
        ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((listing, index) => (
                    <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ListingCard listing={listing} onView={onViewListing} />
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <div className="text-6xl mb-4">🚂</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">All aboard!</h3>
                <p className="text-gray-600">Be the first Boilermaker to list something awesome.</p>
            </div>
        )}
    </section>
);

// Main dashboard component
export default function Dashboard() {
    const [recentListings, setRecentListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState(null);
    const [startContact, setStartContact] = useState(false);
    const [startTrade, setStartTrade] = useState(false);

    // Load listings on component mount
    useEffect(() => {
        const fetchRecentListings = async () => {
            setIsLoading(true);
            try {
                const listings = await Listing.filter({ status: 'active' }, '-created_date', 8);
                setRecentListings(listings);
            } catch (error) {
                console.error("Failed to fetch recent listings:", error);
            }
            setIsLoading(false);
        };
        fetchRecentListings();
    }, []);

    // Handle listing view
    const handleViewListing = (listing, options = {}) => {
        setSelectedListing(listing);
        setStartContact(options.openContact || false);
        setStartTrade(options.openTrade || false);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setSelectedListing(null);
        setStartContact(false);
        setStartTrade(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <HeroSection />
                <StatsBar listingsCount={recentListings.length} />
                <CategoryGrid />
                <RecentListingsSection 
                    listings={recentListings}
                    isLoading={isLoading}
                    onViewListing={handleViewListing}
                />

                {selectedListing && (
                    <ListingDetailModal
                        key={selectedListing.id}
                        listing={selectedListing}
                        onClose={handleCloseModal}
                        startContact={startContact}
                        startTrade={startTrade}
                    />
                )}
            </div>
        </div>
    );
}
