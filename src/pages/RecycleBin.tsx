
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { formatDateFromIso } from '@/lib/studentData';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { 
  Home, 
  Search, 
  RotateCcw, 
  Trash2, 
  Info, 
  User, 
  Users, 
  Calendar, 
  Filter,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RecycleBin = () => {
  const { language, deletedItems, restoreDeletedItem, permanentlyDeleteItem } = useAppContext();
  const t = getTranslations(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'restore' | 'delete'>('restore');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'students' | 'classes'>('all');
  
  // Filter deleted items based on search term and tab
  const filteredItems = deletedItems.filter(item => {
    const matchesSearch = item.type === 'student' 
      ? item.data.name.toLowerCase().includes(searchTerm.toLowerCase())
      : item.data.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = selectedTab === 'all' 
      ? true 
      : selectedTab === 'students' 
      ? item.type === 'student' 
      : item.type === 'class';
      
    return matchesSearch && matchesTab;
  });
  
  // Sort items by deletion date (newest first)
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
  );
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: t.home || 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { label: language === 'en' ? 'Recycle Bin' : 'سلة المحذوفات' },
  ];
  
  // Handle restore/delete actions
  const handleAction = (id: string, action: 'restore' | 'delete') => {
    setSelectedItemId(id);
    setActionType(action);
    setShowConfirmDialog(true);
  };
  
  // Confirm action
  const confirmAction = () => {
    if (!selectedItemId) return;
    
    if (actionType === 'restore') {
      restoreDeletedItem(selectedItemId);
    } else {
      permanentlyDeleteItem(selectedItemId);
    }
    
    setShowConfirmDialog(false);
    setSelectedItemId(null);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="page-container">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-display font-bold">
              {language === 'en' ? 'Recycle Bin' : 'سلة المحذوفات'}
            </h1>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? 'Items are kept for 30 days before permanent deletion' 
                  : 'يتم الاحتفاظ بالعناصر لمدة 30 يومًا قبل الحذف النهائي'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={language === 'en' ? 'Search deleted items...' : 'البحث في العناصر المحذوفة...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {language === 'en' ? 'Filter' : 'تصفية'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedTab('all')}>
                    {language === 'en' ? 'All Items' : 'جميع العناصر'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab('students')}>
                    {language === 'en' ? 'Students Only' : 'الطلاب فقط'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab('classes')}>
                    {language === 'en' ? 'Classes Only' : 'الفصول فقط'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'students' | 'classes')}>
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="flex items-center">
                  {language === 'en' ? 'All Items' : 'جميع العناصر'}
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Students' : 'الطلاب'}
                </TabsTrigger>
                <TabsTrigger value="classes" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Classes' : 'الفصول'}
                </TabsTrigger>
              </TabsList>
              
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {sortedItems.length > 0 
                      ? language === 'en' 
                        ? `Showing ${sortedItems.length} deleted items` 
                        : `عرض ${sortedItems.length} من العناصر المحذوفة`
                      : language === 'en'
                        ? 'No deleted items found'
                        : 'لم يتم العثور على عناصر محذوفة'
                    }
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">
                        {language === 'en' ? 'Type' : 'النوع'}
                      </TableHead>
                      <TableHead>
                        {language === 'en' ? 'Name' : 'الاسم'}
                      </TableHead>
                      <TableHead>
                        {language === 'en' ? 'Details' : 'التفاصيل'}
                      </TableHead>
                      <TableHead>
                        {language === 'en' ? 'Deleted On' : 'تاريخ الحذف'}
                      </TableHead>
                      <TableHead>
                        {language === 'en' ? 'Deleted By' : 'حذف بواسطة'}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === 'en' ? 'Actions' : 'الإجراءات'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                          {language === 'en' ? 'No items found in the recycle bin' : 'لم يتم العثور على عناصر في سلة المحذوفات'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant={item.type === 'student' ? 'default' : 'secondary'}>
                              {item.type === 'student' 
                                ? language === 'en' ? 'Student' : 'طالب' 
                                : language === 'en' ? 'Class' : 'فصل'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.data.name}
                          </TableCell>
                          <TableCell>
                            {item.type === 'student' ? (
                              <div className="flex flex-col text-sm">
                                <span>{item.data.grade}</span>
                                <span className="text-gray-500">
                                  {item.data.nationality === 'international' 
                                    ? language === 'en' ? 'International' : 'دولي'
                                    : language === 'en' ? 'National' : 'محلي'}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col text-sm">
                                <span>{item.data.grade}</span>
                                <span className="text-gray-500">
                                  {language === 'en' 
                                    ? `${item.data.studentCount} students` 
                                    : `${item.data.studentCount} طالب`}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              {formatDateFromIso(item.deletedAt, language)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.deletedBy}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleAction(item.id, 'restore')}
                                    >
                                      <RotateCcw className="h-4 w-4 text-blue-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {language === 'en' ? 'Restore' : 'استعادة'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleAction(item.id, 'delete')}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {language === 'en' ? 'Delete Permanently' : 'حذف نهائي'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
            
            {sortedItems.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Info className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">
                      {language === 'en' ? 'Recovery Information' : 'معلومات الاستعادة'}
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      {language === 'en' 
                        ? 'Items in the recycle bin will be permanently deleted after 30 days. Restore items to make them available again in the system.'
                        : 'سيتم حذف العناصر الموجودة في سلة المحذوفات نهائيًا بعد 30 يومًا. قم باستعادة العناصر لجعلها متاحة مرة أخرى في النظام.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'restore'
                ? language === 'en' ? 'Restore Item' : 'استعادة العنصر'
                : language === 'en' ? 'Permanently Delete' : 'حذف نهائي'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'restore'
                ? language === 'en' 
                  ? 'This will restore the item and make it available in the system again.' 
                  : 'سيؤدي هذا إلى استعادة العنصر وجعله متاحًا في النظام مرة أخرى.'
                : language === 'en'
                  ? 'This will permanently delete the item. This action cannot be undone.' 
                  : 'سيؤدي هذا إلى حذف العنصر نهائيًا. لا يمكن التراجع عن هذا الإجراء.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {actionType === 'restore'
                ? language === 'en' ? 'Yes, Restore' : 'نعم، استعادة'
                : language === 'en' ? 'Yes, Delete Permanently' : 'نعم، حذف نهائيًا'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecycleBin;
