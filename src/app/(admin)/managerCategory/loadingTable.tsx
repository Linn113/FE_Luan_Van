import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableCell,
} from '@/components/ui/table'
import React from 'react'

const LoadingTable = () => {
  return (
    <Card className='mt-2'>
      <CardHeader>
        <Skeleton className="h-6 w-[8rem] bg-slate-200">
          <CardTitle></CardTitle>
        </Skeleton>
        <Skeleton className="h-4 w-[12rem] bg-slate-200">
          <CardDescription></CardDescription>
        </Skeleton>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 bg-slate-200" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 bg-slate-200" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 bg-slate-200" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-4 bg-slate-200" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2, 3, 4].map((item) => (
              <TableRow key={item}>
                <TableCell colSpan={4} className="font-medium">
                  <Skeleton className="h-6 w-full bg-slate-200"></Skeleton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            <Skeleton className="h-2 w-[4rem] bg-slate-200" />
          </div>
          <div className="flex">
            <Skeleton className="h-[2rem] w-[4rem] bg-slate-200 mr-1" />
            <Skeleton className="h-[2rem] w-[4rem] bg-slate-200 ml-1" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LoadingTable
