import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Eye, Phone, ArrowLeftRight, Calendar, Share2, Heart, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '@/api/entities';
import { Listing } from '@/api/entities';
import { createPageUrl } from '@/utils';

// Category color mapping
const CATEGORY_COLORS = {
    'Textbooks': 'bg-blue-100 text-blue-800 border-blue-200',
    'Electronics': 'bg-purple-100 text-purple-800 border-purple-200',
    'Furniture': 'bg-green-100 text-green-800 border-green-200',
    'Clothing & Accessories': 'bg-pink-100 text-pink-800 border-pink-200',
    'Dorm Essentials': 'bg-amber-100 text-amber-800 border-amber-200',
    'School Supplies': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Sports & Outdoors': 'bg-red-100 text-red-800 border-red-200',
    'Transportation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Tickets & Events': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200'
};

// Condition color mapping
const CONDITION_COLORS = {
    'New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Like New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
    'Used': 'bg-red-100 text-red-800 border-red-200'
};

// List view component
const ListViewCard = ({ listing, onView, currentUser, handleShare, formatPrice }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-amber-200 rounded-2xl overflow-hidden">
        <div className="flex p-6 gap-6">
            {/* Image */}
            <div className="w-32 h-32 flex-shrink-0">
                {listing.images?.[0] ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover rounded-xl"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 hover:text-amber-600 cursor-pointer transition-colors"
                            onClick={() => onView(listing)}>
                            {listing.title}
                        </h3>
                        <div className="text-2xl font-bold text-amber-600">
                            ${formatPrice(listing.price)}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`border ${CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other}`}>
                            {listing.category}
                        </Badge>
                        <Badge className={`border ${CONDITION_COLORS[listing.condition] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {listing.condition}
                        </Badge>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(listing.created_date), 'MMM d')}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShare(e);
                            }}
                            className="border-2 border-gray-200 hover:border-amber-300 rounded-xl"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(listing, { openContact: true });
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

// Grid view component  
const GridViewCard = ({ listing, onView, currentUser, handleShare, formatPrice }) => (
    <motion.div
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="h-full group cursor-pointer"
        onClick={() => onView(listing)}
    >
        <Card className="h-full overflow-hidden border-2 border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 rounded-2xl">
            {/* Image */}
            <div className="relative aspect-[4/3]">
                {listing.images?.[0] ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <span className="text-sm">No Image</span>
                        </div>
                    </div>
                )}

                {/* Overlay buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare(e);
                        }}
                    >
                        <Share2 className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                        <Heart className="w-4 h-4 text-gray-600" />
                    </Button>
                </div>

                {/* Status badge */}
                {listing.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge className="bg-red-600 text-white text-lg px-4 py-2 font-bold">
                            SOLD
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                            {listing.title}
                        </h3>
                        <div className="text-xl font-bold text-amber-600 ml-2">
                            ${formatPrice(listing.price)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`text-xs border ${CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other}`}>
                            {listing.category}
                        </Badge>
                        <Badge className={`text-xs border ${CONDITION_COLORS[listing.condition] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {listing.condition}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {listing.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(listing.created_date), 'MMM d')}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                {listing.status !== 'sold' && (
                    <div className="flex gap-2 mt-auto">
                        <Button
                            size="sm"
                            className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(listing, { openContact: true });
                            }}
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                        {currentUser?.email !== listing.seller_email && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-2 border-gray-300 hover:border-amber-400 text-gray-700 hover:text-amber-600 rounded-xl font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(listing, { openTrade: true });
                                }}
                            >
                                <ArrowLeftRight className="w-4 h-4 mr-2" />
                                Trade
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    </motion.div>
);

// Main component
export default function ListingCard({ 
    listing, 
    onView, 
    viewMode = 'grid', 
    showTradeButton = true 
}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [viewCount, setViewCount] = useState(listing.views || 0);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await User.me();
                setCurrentUser(user);
            } catch (error) {
                setCurrentUser(null);
            }
        };
        loadUser();
    }, []);

    // Format price helper
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString();
        }
        return parseFloat(price || 0).toLocaleString();
    };

    // Share functionality
    const handleShare = async (e) => {
        e.stopPropagation();
        const shareData = {
            title: listing.title,
            text: `Check out this item on Boiler Exchange: ${listing.title} - $${listing.price}`,
            url: window.location.origin + createPageUrl(`Browse?listing=${listing.id}`)
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                // You could add a toast notification here
                console.log('Link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
            }
        }
    };

    // Handle click and increment view count
    const handleCardClick = (listing, options = {}) => {
        setViewCount(prev => prev + 1);
        Listing.update(listing.id, { views: viewCount + 1 }).catch(console.error);
        onView(listing, options);
    };

    const commonProps = {
        listing,
        onView: handleCardClick,
        currentUser,
        handleShare,
        formatPrice
    };

    return viewMode === 'list' ? (
        <ListViewCard {...commonProps} />
    ) : (
        <GridViewCard {...commonProps} />
    );
}