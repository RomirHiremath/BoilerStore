import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Listing } from '@/api/entities';
import ListingCard from '../components/listings/ListingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ListingDetailModal from '../components/listings/ListingDetailModal';
import DemandForecast from '../components/dashboard/DemandForecast';

// Constants
const CATEGORIES = [
    "Textbooks", "Electronics", "Furniture", "Clothing & Accessories", 
    "Dorm Essentials", "School Supplies", "Sports & Outdoors", 
    "Transportation", "Tickets & Events", "Other"
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'price_asc', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
];

// Custom hook for URL query parameters
const useQueryParams = () => {
    const location = useLocation();
    return new URLSearchParams(location.search);
};

// Filter sidebar component
const FilterSidebar = ({ 
    filters, 
    onFilterChange, 
    onReset, 
    isMobile, 
    isOpen, 
    onClose 
}) => {
    const sidebarClasses = isMobile 
        ? `fixed inset-0 z-50 bg-white p-6 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
        : 'w-80 sticky top-6 h-fit';

    return (
        <div className={sidebarClasses}>
            {isMobile && (
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Filter className="w-6 h-6 text-amber-600" />
                        Filters
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-6 h-6" />
                    </Button>
                </div>
            )}

            <div className="space-y-8">
                {!isMobile && (
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-amber-600" />
                        Refine Results
                    </h2>
                )}

                {/* Category Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Category
                    </label>
                    <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-amber-500 rounded-xl">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Condition
                    </label>
                    <Select value={filters.condition} onValueChange={(value) => onFilterChange('condition', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-amber-500 rounded-xl">
                            <SelectValue placeholder="All Conditions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            {CONDITIONS.map(condition => (
                                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Price Range
                    </label>
                    <div className="px-3">
                        <Slider
                            value={filters.priceRange}
                            onValueChange={(value) => onFilterChange('priceRange', value)}
                            max={1000}
                            step={10}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                        <Badge variant="outline">${filters.priceRange[0]}</Badge>
                        <Badge variant="outline">
                            ${filters.priceRange[1] === 1000 ? '1000+' : filters.priceRange[1]}
                        </Badge>
                    </div>
                </div>

                {/* Demand Forecast */}
                <DemandForecast category={filters.category !== 'all' ? filters.category : null} />

                {/* Reset Button */}
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-red-400 hover:text-red-600 rounded-xl"
                >
                    <X className="w-4 h-4 mr-2" />
                    Reset All Filters
                </Button>
            </div>
        </div>
    );
};

// Header section component
const BrowseHeader = ({ 
    searchTerm, 
    onSearchChange, 
    sortBy, 
    onSortChange, 
    showSold, 
    onToggleSold, 
    resultCount, 
    viewMode, 
    onViewModeChange,
    onToggleFilters 
}) => (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {showSold ? 'Sold Items' : 'Browse Marketplace'}
                </h1>
                <p className="text-gray-600">
                    {resultCount} {resultCount === 1 ? 'item' : 'items'} found
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 lg:w-80">
                    <Input
                        placeholder="Search for anything..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-amber-500 rounded-xl text-base"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-amber-500 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={onToggleSold}
                        variant={showSold ? "default" : "outline"}
                        className={showSold ? 
                            "bg-amber-600 hover:bg-amber-700 text-white rounded-xl" : 
                            "border-2 border-gray-300 hover:border-amber-500 rounded-xl"
                        }
                    >
                        {showSold ? 'Show Active' : 'Show Sold'}
                    </Button>

                    <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                        <Button
                            variant={viewMode === 'grid' ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className="rounded-lg"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            className="rounded-lg"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button
                        onClick={onToggleFilters}
                        className="lg:hidden bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

// Main browse component
export default function Browse() {
    const queryParams = useQueryParams();
    
    // State management
    const [allListings, setAllListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState(null);
    const [startContact, setStartContact] = useState(false);
    const [startTrade, setStartTrade] = useState(false);
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Filter state
    const [filters, setFilters] = useState({
        searchTerm: queryParams.get('search') || '',
        category: queryParams.get('category') || 'all',
        condition: 'all',
        priceRange: [0, 1000],
        sortBy: 'newest',
        showSold: false
    });

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch listings
    const fetchListings = useCallback(async () => {
        setIsLoading(true);
        try {
            const listings = await Listing.list();
            setAllListings(listings);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchListings();
        
        // Handle direct listing access
        const listingId = queryParams.get('listing');
        if (listingId) {
            const fetchSpecificListing = async () => {
                try {
                    const listing = await Listing.get(listingId);
                    if (listing) handleViewListing(listing);
                } catch (error) {
                    console.error("Failed to fetch shared listing:", error);
                }
            };
            fetchSpecificListing();
        }
    }, [fetchListings, queryParams]);

    // Filter and sort listings
    const filteredListings = useMemo(() => {
        let result = [...allListings];

        // Filter by status
        result = filters.showSold
            ? result.filter(listing => listing.status === 'sold')
            : result.filter(listing => listing.status === 'active');

        // Apply filters
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            result = result.filter(listing =>
                listing.title.toLowerCase().includes(term) ||
                listing.description.toLowerCase().includes(term)
            );
        }

        if (filters.category !== 'all') {
            result = result.filter(listing => listing.category === filters.category);
        }

        if (filters.condition !== 'all') {
            result = result.filter(listing => listing.condition === filters.condition);
        }

        result = result.filter(listing => 
            listing.price >= filters.priceRange[0] && 
            listing.price <= filters.priceRange[1]
        );

        // Apply sorting
        switch (filters.sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                break;
        }

        return result;
    }, [allListings, filters]);

    // Event handlers
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            category: 'all',
            condition: 'all',
            priceRange: [0, 1000],
            sortBy: 'newest',
            showSold: false
        });
        setShowFiltersMobile(false);
    };

    const handleViewListing = (listing, options = {}) => {
        setSelectedListing(listing);
        setStartContact(options.openContact || false);
        setStartTrade(options.openTrade || false);
    };

    const handleCloseModal = (shouldRefresh = false) => {
        setSelectedListing(null);
        setStartContact(false);
        setStartTrade(false);
        if (shouldRefresh) fetchListings();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                <BrowseHeader
                    searchTerm={filters.searchTerm}
                    onSearchChange={(value) => handleFilterChange('searchTerm', value)}
                    sortBy={filters.sortBy}
                    onSortChange={(value) => handleFilterChange('sortBy', value)}
                    showSold={filters.showSold}
                    onToggleSold={() => handleFilterChange('showSold', !filters.showSold)}
                    resultCount={filteredListings.length}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onToggleFilters={() => setShowFiltersMobile(true)}
                />

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    {!isMobile && (
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={resetFilters}
                            isMobile={false}
                        />
                    )}

                    {/* Mobile Sidebar */}
                    {isMobile && (
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={resetFilters}
                            isMobile={true}
                            isOpen={showFiltersMobile}
                            onClose={() => setShowFiltersMobile(false)}
                        />
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 rounded-2xl h-64 mb-4" />
                                        <div className="bg-gray-200 h-4 rounded mb-2" />
                                        <div className="bg-gray-200 h-6 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredListings.length > 0 ? (
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }>
                                {filteredListings.map(listing => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onView={handleViewListing}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-100">
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">No items found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters to find what you're looking for.
                                </p>
                                <Button
                                    onClick={resetFilters}
                                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
    );
}